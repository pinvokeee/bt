class timeCardManager
{
    constructor(name, kintone_subdomain, appId, appToken)
    {
        this.subDomain = kintone_subdomain;
        this.appId = appId;
        this.appToken = appToken;
        this.userName = name;
    }

    getTodayRecord()
    {
        const req_body = this.createRequestBody(this.createTimeCardQuery());

        return new Promise((resolve, reject) => 
        {
            fetch(`https://${this.subDomain}.cybozu.com/k/v1/records.json`, 
            {
                method: "POST",
                headers:
                {  
                    "X-HTTP-Method-Override": "GET",
                    "Content-Type": "application/json",
                    "X-Cybozu-API-Token": this.appToken
                },
                body: JSON.stringify(req_body)

            }).then(r => r.json()).then(r => 
            {
                const length = r.records.length;

                if (length == 0) 
                {
                    resolve({
                        instance: this, 
                        record: null,
                    });
                    return;
                }

                resolve(
                {
                    instance: this, 
                    record: this.parseRecord(r.records[0])
                });
            });
        });        
    }

    registTodayRecord(record)
    {
        const req_body = this.createRecordData(record);
        
        return new Promise((resolve, reject) => 
        {
            fetch(`https://${this.subDomain}.cybozu.com/k/v1/record.json`, 
            {
                method: "POST",
                headers:
                {
                    "Content-Type": "application/json",
                    "X-Cybozu-API-Token": this.appToken
                },
                body: JSON.stringify(req_body)

            }).then(r => r.json()).then(r => 
            {
                resolve(r);
            });
        });     
    }

    parseRecord(record)
    {
        const tc = new timeCardRecord();

        tc.number = record["社員番号"].value;
        tc.userName = record["氏名"].value;
        tc.location = record["形態"].value;
        tc.inDateTime = this.partTime(record["出勤"].value);
        tc.outDateTime = this.partTime(record["退勤"].value);
        tc.startRunchTime = this.partTime(record["昼休憩開始"].value);
        tc.endRunchTime = this.partTime(record["昼休憩終了"].value);

        return tc;
    }

    partTime(value)
    {
        return value.length > 0 ? new Date(value) : null;
    }

    createRequestBody(query)
    {
        const body = 
        {
            "app": this.appId,
            "query": query,
        }

        return body;
    }

    createTimeCardQuery()
    {
        const d = new Date();
        const req = [];        
        req.push("氏名", "=", `\"${this.userName}\"`, "and");
        req.push("出勤", ">=",  `\"${this.toDateString(d)}T00:00:00+0900\"`, "and");
        req.push("出勤", "<=", `\"${this.toDateString(d)}T23:59:59+0900\"`);
        return req.join(" ");
    }

    toDateTimeString(d, tz)
    {
        if (d == null) return null;
        return `${this.toDateString(d)}T${this.toTimeString(d)}${tz}`;
    }

    toDateString(d)
    {
        if (d == null) return null;
        return `${d.getFullYear()}-${this.zeroLeft(d.getMonth()+1)}-${this.zeroLeft(d.getDate())}`;
    }

    toTimeString(dt)
    {
        if (dt == null) return null;
        const h = dt.getHours(), m = dt.getMinutes(), s = dt.getSeconds();
        return `${this.zeroLeft(h)}:${this.zeroLeft(m)}:${this.zeroLeft(s)}`;
    }

    zeroLeft(str)
    {
        return ("0" + str).slice(-2);
    }

    createRecordData(record)
    {
        const json = 
        {
            "app": this.appId,
            "record":
            {
                "氏名": 
                {
                    "value": this.userName,
                },

                "出勤":
                {
                    "value": this.toDateTimeString(record.inDateTime, "+0900")
                },

                "退勤":
                {
                    "value": this.toDateTimeString(record.outDateTime, "+0900")
                },
                
                "_10分休憩1回目開始":
                {
                    "value": this.toDateTimeString(record.start10mBreakTime1, "+0900")
                },

                "_10分休憩1回目終了":
                {
                    "value": this.toDateTimeString(record.end10mBreakTime1, "+0900")
                },

                "_10分休憩2回目開始":
                {
                    "value": this.toDateTimeString(record.start10mBreakTime2, "+0900")
                },

                "_10分休憩2回目終了":
                {
                    "value": this.toDateTimeString(record.end10mBreakTime2, "+0900")
                },

                "形態":
                {
                    "value": "在宅",
                }
            },
        }

        return json;
    }

    punchIn()
    {
        return new Promise((resolve, rej) =>
        {
            const record = new timeCardRecord();
            record.userName = this.userName;
            record.inDateTime = new Date();
            
            this.registTodayRecord(record).then(r =>
            {
                console.log(r);
                this.getTodayRecord().then((res) =>
                {
                    console.log(res);
                    resolve(res);
                });                
            });
        });
    }
}

class timeCardRecord
{
    constructor()
    {
        this.number = "0";
        this.userName = "",
        this.location = "";
        this.inDateTime = null;
        this.outDateTime = null;
        this.startRunchTime = null;
        this.endRunchTime = null;

        this.start10mBreakTime1 = null;
        this.end10mBreakTime1 = null;


        this.start10mBreakTime2 = null;
        this.end10mBreakTime2 = null;

        this.BreakTime10M = [2];

        this.BreakTime10M[0] = {
            start: null,
            end: null
        };

        this.BreakTime10M[1] = {
            start: null,
            end: null
        };
    
    } 

    isRunning10MBreakTime()
    {
        return this.BreakTime10M[1].start != null;
    }

    getNext10MBreak()
    {
        for (const i = 0; i < this.BreakTime10M.length; i++)
        {
            const o = this.BreakTime10M[i];

            if (o.end == null)
            {
                return { index: i, obj: o };
            } 
        }
    }

    run10mBreak()
    {
        const d = new Date();
        const bdata = this.getNext10MBreak();
        bdata.obj.start = d;

        console.log(bdata);
    }
}