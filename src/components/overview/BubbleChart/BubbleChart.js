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
        let partitions={};
        let subSetUris=store.each(undefined,ns.bgo("hasAccount"),account);
        subSetUris.forEach(subSetUri=>{
            let partition=store.any(undefined,ns.bgo("hasAccountSubSet"),subSetUri);
            let partitionId=store.anyValue(partition,ns.bgo("partitionId"))
            partitions[partitionId]=subSetUri.value;   
        });

        nodes.push({
            id,
            title,
            description,
            amount,
            rate,
            bg,
            partitions,
            x: Math.random() * width,
            y: Math.random() * height,
        })

        nodes.sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount));

    })
    return nodes;
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

        const radiusScale = d3.scalePow().exponent(0.5)
            .domain([0, maxAmount]).range([5, 100]);

        const colorScale = (val) => {
            let fill = d3.scaleLinear()
                .domain([-1, 1])
                .range([minTrendColor, maxTrendColor])
                .clamp(true);

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
            .on("mouseover", function () {
                this.style["stroke-width"] = 4;
            })
            .on("mouseout", function () {
                this.style["stroke-width"] = 1;
            });

        // native tooltip
        bubbles.append('title').text(function (d) {
            return `${d.title}\n${d.rate * 100}%`;
        })

        bubbles
            .transition()
            .duration(2000)
            .attr("r", function (d) {
                return radiusScale(d.amount);
            });


        const ticked = () => {
            bubbles
                .attr("cx", function (d) {
                    return d.x;
                })
                .attr("cy", function (d) {
                    return d.y;
                });
        }
        const charge = (d) => {
            return -Math.pow(radiusScale(d.amount), 2.0) * this.forceStrength;
        }

        this.simulation = d3
            .forceSimulation()
            .velocityDecay(this.velocityDecay)
            .nodes(this.nodes)
            .force("charge", d3.forceManyBody().strength(charge))
            .on("tick", ticked)
            .stop()

        this.groupBubble();

    }

    groupBubble() {
        this.simulation.force("x", d3.forceX().strength(this.forceStrength).x(this.width / 2));
        this.simulation.force("y", d3.forceY().strength(this.forceStrength).y(this.height / 2));
        this.simulation.alpha(1).restart();
    }

    update(width, height) {
        this.simulation.force("x", d3.forceX().strength(this.forceStrength).x(width / 2));
        this.simulation.force("y", d3.forceY().strength(this.forceStrength).y(height / 2));
        this.simulation.alpha(1).restart();
    }


}