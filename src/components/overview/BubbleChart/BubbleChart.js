import * as d3 from 'd3';


function createNodes(store, ns, width, height) {
    let nodes = [];
    store.each(null, ns.rdf('type'), ns.bgo('Account')).forEach(account => {

        let id = store.anyValue(account, ns.bgo('accountId'));

        let title = store.anyValue(account, ns.bgo('title'));
        title = title ? title : "";

        let description = store.anyValue(account, ns.bgo('description'));
        description = description ? description : "";

        let amount = store.anyValue(account, ns.bgo('amount'));
        amount = amount ? parseFloat(amount) : 0;

        let refAmount = store.anyValue(account, ns.bgo('referenceAmount'));
        refAmount = refAmount ? parseFloat(refAmount) : 0;

        let rate = (amount - refAmount) / refAmount;
        rate = isFinite(rate) ? rate : 0;

        let bg = store.anyValue(account, ns.bgo('background'));
        nodes.push({
            id,
            title,
            description,
            amount,
            rate,
            bg,
            x: Math.random() * width,
            y: Math.random() * height
        })

        nodes.sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount));

    })
    return nodes;
}

function fillColor(val) {
    const colorScale = scaleThreshold()
        .domain([-0.25, -0.05, 0, 0.05, 0.25])
        /* 0  .range(["#D84B2A", "#EE9586", "#E4B7B2", "#BECCAE", "#9CAF84", "#7AA25C"]); */
        /* 1 .range(["#c51b7d", "#e9a3c9", "#fde0ef", "#e6f5d0", "#a1d76a", "#4d9221"]); */
        /* 2 .range(["#b2182b", "#ef8a62", "#fddbc7", "#d1e5f0", "#67a9cf", "#2166ac"]); */
        /* 3 .range(["#d73027", "#fc8d59", "#fee08b", "#d9ef8b", "#91cf60", "#1a9850"]); */
        /* -1 .range(["#f0f9e8", "#ccebc5", "#a8ddb5", "#7bccc4", "#43a2ca", "#0868ac"]);
        d3.scaleLinear()
              .domain([-1, 1]).range(["salmon", "pink"]) */
        /*  4.range(["#762a83", "#af8dc3", "#e7d4e8", "#d9f0d3", "#7fbf7b", "#1b7837"]); */
        .range(["#762a83", "#af8dc3", "#e7d4e8", "#d9f0d3", "#7fbf7b", "#1b7837"]);

    if (isFinite(val)) {
        return colorScale(val);
    }
    return "#dedede";
}
export default class BubbleChart {

    constructor(el, bgolib, width, height) {
        this.el = el;
        this.height = height;
        this.width = width;
        this.store = bgolib.bgoStore;
        this.ns = bgolib.ns;
        this.velocityDecay = 0.2;
        this.forceStrength = 0.03;
        this.simulation;
        this.nodes = [];
    }



    render() {
        this.nodes = createNodes(this.store, this.ns, this.width, this.height);
        console.table(this.nodes);
        const maxAmount = this.nodes[0].amount;
        const overview = this.store.any(null, this.ns.rdf('type'), this.ns.bgo('Overview'));
        const colorScheme = this.store.any(overview, this.ns.bgo('hasTrendColorScheme'));
        const noTrendColor = this.store.anyValue(colorScheme, this.ns.bgo('noTrendColor'));
        const maxTrendColor = this.store.anyValue(colorScheme, this.ns.bgo('maxTrendColor'));
        const minTrendColor = this.store.anyValue(colorScheme, this.ns.bgo('minTrendColor'));
        // console.log('colorScheme', noTrendColor);

        // const minAmount = this.nodes[this.nodes.length - 1].amount;
        const radiusScale = d3.scalePow().exponent(0.5)
            .domain([0, maxAmount]).range([5, 100]);

        const colorScale = (val) => {
            let fill = d3.scaleLinear()
                .domain([-1, 1]).range([minTrendColor, maxTrendColor]);

            if (isFinite(val)) {
                return fill(val);
            }
            return noTrendColor;
        }


        let bubbles = d3.select("svg#vis")
            .selectAll("circle")
            .data(this.nodes)
            .enter()
            .append("circle")
            .classed("bubble", true)
            .attr("r", 0)
            .attr("fill", function (d) {
                return colorScale(d.rate);
            })
            .attr("stroke", function (d) {
                return d3.rgb(colorScale(d.rate)).darker();
            })
            .on("mouseover", function (d) {
                this.style["stroke-width"] = 4;
            })
            .on("mouseout", function (d) {
                this.style["stroke-width"] = 1;
            });

        bubbles
            .transition()
            .duration(2000)
            .attr("r", function (d) {
                return radiusScale(d.amount);
            });


        function ticked() {
            bubbles
                .attr("cx", function (d) {
                    return d.x;
                })
                .attr("cy", function (d) {
                    return d.y;
                });
        }
        let charge = (d) => {
            return -Math.pow(radiusScale(d.amount), 2.0) * this.forceStrength;
        }

        this.simulation = d3
            .forceSimulation()
            .velocityDecay(this.velocityDecay)
            .nodes(this.nodes)
            .force("charge", d3.forceManyBody().strength(charge))
            .on("tick", ticked)
            .stop()

        this.simulation.force("x", d3.forceX().strength(this.forceStrength).x(this.width / 2)
        );
        this.simulation.force("y", d3.forceY().strength(this.forceStrength).y(this.height / 2)
        );
        this.simulation.alpha(1).restart();

    }



}