const App = 
{
    components:
    {
        "timerComponent": timerComponent,
        // "controlComponent": controlComponent,
    },

    data()
    {
        return {
            timeCard: new timeCardManager("abbb", "hhmjnb8jvwyj", "10", "nRGRgXWkf8bZ2rUZ8TglJyQk1GxbH2iRBIdSZs1T"),
            currentRecord: null,

            breakTime10MText: "",

            timer:
            {
                Break10MCounter: null,
            },

        }
    },

    mounted()
    {
        this.timeCard.getTodayRecord().then((obj) => 
        {
            this.currentRecord = obj.record;

            if (this.currentRecord == null)
            {
                this.timeCard.punchIn().then(r =>
                {
                    this.currentRecord =  r.record; 
                });
            }
        });
    },

    computed:
    {
        location: 
        {
            get()
            {
                return this.currentRecord != null ? this.currentRecord.location : "";
            },

            set(value)
            {
                this.currentRecord.location = value;
            }
        },

        isStarted10MBreak:
        {
            get()
            {
                if (this.currentRecord == null) return false;

                return (this.currentRecord.BreakTime10M[0].start != null &&
                this.currentRecord.BreakTime10M[0].end == null) ||
                (this.currentRecord.BreakTime10M[1].start != null &&
                this.currentRecord.BreakTime10M[1].end == null)
            }
        },

        next10MBreak:
        {
            get()
            {
                if (this.currentRecord == null) return null;

                if (this.currentRecord.BreakTime10M[0].end == null) return this.currentRecord.BreakTime10M[0];                
                if (this.currentRecord.BreakTime10M[1].end == null) return this.currentRecord.BreakTime10M[1];
            }
        },

        a:
        {
            get()
            {
                if (this.currentRecord == null) return "";
                return this.currentRecord.BreakTime10M[0].start;   
            }
        },

        // isStarted10MBreak:
        // {
        //     get()
        //     {
        //         const b = this.currentRecord.getNext10MBreak();
        //         console.log(b);
        //     }
        // }

        // location: 
        // {
        //     get()
        //     {
        //         return this.currentRecord != null ? this.currentRecord.location : "";
        //     },

        //     set(value)
        //     {
        //         this.currentRecord.location = value;
        //     }
        // }
    },

    methods:
    {
        run_10mBreakTime()
        {
            this.currentRecord.run10mBreak();
            this.countBreak10M();
        },

        getBreakTime10MText()
        {
            if (this.currentRecord == null) return "";

            

            // const b = this.currentRecord.getNext10MBreak();

            // if (b.obj.start == null)
            // {
            //     return `10分休憩 ${b.index+1}回目`;
            // }
            
            // if (b.obj.start != null && b.obj.end == null)
            // {
            //     console.log("AADA");
            //     const t = (new Date() - b.obj.start);
            //     return t;
            // }                            
        },

        breakTime10MText()
        {
            return this.getBreakTime10MText();
        },

        countBreak10M()
        {
            if (!this.isStarted10MBreak) 
            {
                this.timer.Break10MCounter = 0;
                return;
            }

            this.timer.Break10MCounter++;

            setInterval(this.countBreak10M, 1000);
        }
      
    },

    template: `

        <div class="d-flex h-100 align-items-center">
            <div class="container-fluid">
                
                <div class="row justify-content-center">
                    <div class="col-12">
                        <timerComponent></timerComponent>
                    </div>
                </div>
    
                <div class="row justify-content-center mb-2">
                    <div class="btn-group" role="group">
                        <button class="btn btn-outline-primary col-7" @click="run_10mBreakTime">{{timer.Break10MCounter}}</button>
                        <button class="btn btn-outline-success col-3">1時間休憩</button>
                        <button class="btn btn-danger col-2">退勤</button>
                    </div>
                </div>

                <div class="row justify-content-center mb-2">
                    
                    <div class="col-12">
                        <select class="form-select w-100" v-model="location">
                            <option>在宅</option>
                            <option>現地</option>
                        </select>
                    </div>

                </div>

                <div class="row justify-content-center mb-2">
                    <label class="col-3 col-form-label">ヘルプ時間</label>
                    <div class="col-9">
                        <input class="form-control w-100">
                    </div>                                       
                </div>

                <div class="row justify-content-center mb-2">
                    <label class="col-3 col-form-label">備考</label>
                    <div class="col-9">
                        <input class="form-control w-100">
                    </div>                    
                </div>

                <div class="d-grid d-flex justify-content-end">
                    <button class="btn btn-danger col-2">更新</button>                    
                </div>

            </div>
        </div>

    `
}