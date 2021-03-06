<template>
    <trading-vue :data="chart" ref="tradingVue" :width="this.width" :height="this.height"
         :overlays="overlays"
         :title-text="title"
         :toolbar="true"
         :chartConfig="{TB_ICON_BRI: 1.9, DEFAULT_LEN: 200}"
         :colorBack="colors.white"
         :colorGrid="colors.lightGrey"
         :colorText="colors.textBlack"
         :colorCandleUp="colors.green"
         :colorCandleDw="colors.red"
         :colorWickUp="colors.green"
         :colorWickDw="colors.red"
         :colorVolUp="colors.greenT4"
         :colorVolDw="colors.redT4"
         :priceLine="false"
         :showVolume="false"
         :legend-buttons="buttons"
         v-on:legend-button-click="onLegendButtonClick"
    >
    </trading-vue>
</template>

<script>

import { TradingVue, DataCube} from 'trading-vue-js'
//import Data from '../../data/data.json'
//import Overlays from 'tvjs-overlays'
//import Grin from './Grin.vue'
//import PerfectTrades from './overlays/PerfectTrades.vue'
import XAmdc from './overlays/XAmdc.vue'
import XCandles from './overlays/XCandles.vue'
import XSpline from './overlays/XSpline.vue'
import XRating from './overlays/XRating.vue'

export default {
    name: 'MainChart',
    //description: 'Main Chart',
    props: ['bus'],
    components: {
        TradingVue
    },

    data() {
        return {
            // chart: Data,
            chart: new DataCube({
                chart: {
                    name: "NONE",
                    type: "XCandles",
                    indexBased: true,
                    data: [],
                },
                onchart: [
                    {
                        name: "AMDC",
                        type: "XAmdc",
                        data: [],
                        settings: {
                            "z-index": -100,
                        }
                    },
                    {
                        name: "EMA200",
                        type: "XSpline",
                        data: [],
                        settings: {
                            lineWidth: 3,
                            color: "#7f7f7f",
                            "z-index": -10,
                        }
                    },
                    {
                        name: "EMA50",
                        type: "XSpline",
                        data: [],
                        settings: {
                            lineWidth: 2,
                            color: "#4D8AEE",
                            "z-index": -5,
                        }
                    },
                    {
                        name: "EMA10",
                        type: "XSpline",
                        data: [],
                        settings: {
                            lineWidth: 1,
                            color: "#007f00",
                            "z-index": 5,
                        }
                    },
                    {
                        name: "CR",
                        type: "XRating",
                        data: [],
                        settings: {
                            lineWidth: 1,
                            color: "#DA525F",
                            "z-index": 6,
                        }
                    },
                    {
                        name: "ER",
                        type: "XRating",
                        data: [],
                        settings: {
                            lineWidth: 1,
                            color: "#FF9800",
                            "z-index": 6,
                        }
                    },
                    {
                        name: "RR",
                        type: "XRating",
                        data: [],
                        settings: {
                            lineWidth: 1,
                            color: "#5891EF",
                            "z-index": 6,
                        }
                    },
                    {
                        name: "AD",
                        type: "XRating",
                        data: [],
                        settings: {
                            lineWidth: 1,
                            color: "#d50b90",
                            "z-index": 6,
                        }
                    },
                    {
                        name: "SMR",
                        type: "XRating",
                        data: [],
                        settings: {
                            lineWidth: 1,
                            color: "#612ff9",
                            "z-index": 6,
                        }
                    },
                ],
                offchart: [],
            }),
            //chart: {},
            width: window.innerWidth,
            height: window.innerHeight,
            colors: {
                white: '#FFFFFF',
                lightGrey: '#E0E9F0',   // Good for grid color
                darkGrey: '#474953',
                textBlack: '#303030',
                lightBlack: '#30333C',
                green: '#4CAF50',
                greenT4: '#4CAF507F',
                red: '#FF5252',
                redT4: '#FF52527F',
                orange: '#FF9800',
                blue: '#4D8AEE',
                lightBlue: '#5891EF',
                pinkishRed: '#DA525F',
                green2: '#58998F',
            },
            buttons: [
                'display', 'up'
            ],
            overlays: [XAmdc, XCandles, XSpline, XRating],
            title: "ABCD",
        }
    },

    // mounted() gets called when trading-vue has completely loaded. Has it already loaded the chart data???
    mounted() {
        window.addEventListener('resize', this.onResize)
        setTimeout(() => {
            // Async data setup
            //this.$set(this, 'chart', new DataCube())
        }, 0)
        this.onResize()
        this.bus.$on('loadChartData', this.loadChartData)
        this.bus.$on('refreshChart', this.refreshChart)
        this.bus.$on('showHideAmdc', this.showHideAmdc)
        this.bus.$on('showHideEsm', this.showHideEsm)
        this.bus.$on('showHideTrades', this.showHideTrades)

    },

    beforeDestroy() {
        window.removeEventListener('resize', this.onResize)
    },

    methods: {
        onResize(event) {
            this.width = window.innerWidth
            this.height = window.innerHeight - 56
            console.log(event) // This is to avoid getting unused variable error during build time
        },

        onLegendButtonClick(event) {
            //console.log(this.chart)
            //console.log(event)
            if (event.button === 'display') {
                let d = this.chart.data[event.type][event.dataIndex]
                if (d) {
                    if (!('display' in d.settings)) {
                        this.$set(d.settings, 'display', true
                        )
                    }
                    this.$set(d.settings, 'display', !d.settings.display
                    )
                }
            }
        },

        showHideAmdc(displayVal) {
            this.chart.merge('onchart.XAmdc0.settings', {display: displayVal})
        },

        showHideEsm(displayVal) {
            this.chart.merge('onchart.XRating0.settings', {display: displayVal})
            this.chart.merge('onchart.XRating1.settings', {display: displayVal})
            this.chart.merge('onchart.XRating2.settings', {display: displayVal})
            this.chart.merge('onchart.XRating3.settings', {display: displayVal})
            this.chart.merge('onchart.XRating4.settings', {display: displayVal})
        },

        showHideTrades(displayVal) {
            this.chart.merge('onchart.XTrades0.settings', {display: displayVal})
        },

        async loadChartData(symbol) {
            console.log("MainChart::loadChartData symbol = " + symbol)
            await this.loadPriceData(symbol)
            await this.loadAmdcData()
            await this.loadRatingsData(symbol)
            await this.refreshChart()
        },

        async loadPriceData(symbol) {
            console.log("MainChart::loadPriceData symbol = " + symbol)
            var timeFrame = this.$store.state.currentTimeFrame
            var url = "https://streamer.hnsib.net/streamer/api/pricedata/symbols/" + symbol + "/?timeFrame=" + timeFrame
            console.log("MainChart::loadPriceData ", url)
            var response = (await fetch(url).then(response => response.json()))
            //console.log(response)
            var result = response.result
            var priceData = []
            for (var i = 0; i < result.length; i++) {
                var ohlc = []
                ohlc[0] = new Date(result[i][0]).getTime()
                ohlc[1] = result[i][1]
                ohlc[2] = result[i][2]
                ohlc[3] = result[i][3]
                ohlc[4] = result[i][4]
                ohlc[5] = result[i][5]
                priceData.push(ohlc)
            }
            //console.log(priceData);
            console.log("MainChart::loadPriceData ---> old chart.name = ", this.chart.get("chart.name"))
            this.chart.set('chart.name', symbol)
            this.chart.set('chart.data', priceData)

            // Update vuex state
            this.$store.commit("newSymbolLoaded", {
                symbol: symbol,
                companyName: symbol,
                ohlc: priceData,
            })

            // Calculate 200 day EMA
            var emaData = this.calulateEma(200, priceData)
            // console.log("MainChart::loadPriceData emaData", emaData)
            this.chart.set('onchart.XSpline0.data', emaData)

            // Calculate 50 day EMA
            emaData = this.calulateEma(50, priceData)
            // console.log("MainChart::loadPriceData emaData", emaData)
            this.chart.set('onchart.XSpline1.data', emaData)

            // Calculate 10 day EMA
            emaData = this.calulateEma(10, priceData)
            // console.log("MainChart::loadPriceData emaData", emaData)
            this.chart.set('onchart.XSpline2.data', emaData)
        },

        calulateEma(emaPeriod, priceData) {
            var k = 2.0 / (1 + emaPeriod)
            var kPrime = 1.0 - k
            var emaData = []
            emaData[0] = []
            emaData[0][0] = priceData[0][0]
            emaData[0][1] = priceData[0][4]
            for (var i = 1; i < priceData.length; i++) {
                emaData[i] = []
                emaData[i][0] = priceData[i][0]
                emaData[i][1] = priceData[i][4] * k + emaData[i-1][1] * kPrime
            }
            return emaData
        },

        async loadAmdcData() {
            // https://streamer.hnsib.net/streamer/api/amdc/?timeFrame=daily
            console.log("MainChart::loadAmdcData() called")
            var timeFrame = this.$store.state.currentTimeFrame
            var url = "https://streamer.hnsib.net/streamer/api/amdc/?timeFrame=" + timeFrame
            console.log("MainChart::loadAmdcData ", url)
            var response = (await fetch(url).then(response => response.json()))
            console.log("MainChart::loadAmdcData response", response)
            var result = response.result
            //console.log("MainChart::loadAmdcData result", result)

            //console.log(this.chart.get('onchart'))

            if (result == null) {
                return
            }
            for (var i = 0; i < result.length; i++) {
                result[i][0] = new Date(result[i][0]).getTime()
            }
            //console.log("MainChart::loadAmdcData result2", result)
            this.chart.set('onchart.XAmdc0.data', result)
        },

        async loadRatingsData(symbol) {
            console.log("MainChart::loadRatingsData() called")
            var url = "https://streamer.hnsib.net/streamer/api/fundamentals/ratings/symbols/" + symbol + "/"
            console.log("MainChart::loadRatingsData ", url)
            var response = (await fetch(url).then(response => response.json()))
            console.log("MainChart::loadRatingsData response", response)
            var result = response.result
            //console.log("MainChart::loadRatingsData result", result)

            console.log(this.chart.get('onchart'))

            if (result == null) {
                return
            }
            var cr = []
            var er = []
            var rr = []
            var ad = []
            var smr = []
            for (var i = 0; i < result.length; i++) {
                var date = new Date(result[i][0]).getTime()
                cr[i] = []
                cr[i][0] = date
                cr[i][1] = result[i][1]
                er[i] = []
                er[i][0] = date
                er[i][1] = result[i][2]
                rr[i] = []
                rr[i][0] = date
                rr[i][1] = result[i][3]
                ad[i] = []
                ad[i][0] = date
                ad[i][1] = result[i][4]
                smr[i] = []
                smr[i][0] = date
                smr[i][1] = result[i][5]
            }
            //console.log("MainChart::loadRatingsData cr", cr)
            //console.log("MainChart::loadRatingsData er", er)
            //console.log("MainChart::loadRatingsData rr", rr)
            // "onchart.XRating0"
            this.chart.set('onchart.XRating0.data', cr)
            this.chart.set('onchart.XRating1.data', er)
            this.chart.set('onchart.XRating2.data', rr)
            this.chart.set('onchart.XRating3.data', ad)
            this.chart.set('onchart.XRating4.data', smr)
        },

        async refreshChart() {
            console.log("MainChart::refreshChart")
            // Call resetChart() whenever timeframe changes -> this will trigger recalculation of the x-axis.
            if (this.$refs.tradingVue) {  // Somehow sometimes this is "undefined"...weird.
                this.$refs.tradingVue.resetChart()
            }
        }
    },

}
</script>


<style>


</style>
