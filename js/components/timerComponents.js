const timerComponent =
{
    data()
    {
        return {
            now: new Date(),
        }
    },

    mounted()
    {
        this.count();
    },

    methods:
    {
        count()
        {   
            this.now = new Date();
            setTimeout(this.count, 1000);
        },

        getToday()
        {
            return `${this.now.getFullYear()}年${this.now.getMonth()+1}月${this.now.getDate()}日(${this.getWeek(this.now.getDay())})`;
        },

        getTime()
        {
            return `${this.padLeft(this.now.getHours())}:${this.padLeft(this.now.getMinutes())}:${this.padLeft(this.now.getSeconds())}`;
        },

        getWeek(index)
        {
            return ["日", "月", "火", "水", "木", "金", "土"][index];
        },

        padLeft(str)
        {
            return ("0" + str).slice(-2);
        }
    },

    template: `
        <div style="font-weight: bold; font-size: 15pt" class="text-center">{{getToday()}}</div>
        <div style="font-weight: bold; font-size: 30pt" class="text-center">{{getTime()}}</div>
    `
}