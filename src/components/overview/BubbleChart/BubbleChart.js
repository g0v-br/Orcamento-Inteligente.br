
import { select, event } from "d3-selection";
// import * as d3 from 'd3'
import { drag } from "d3-drag";
import { transition } from "d3-transition";
import { rgb } from "d3-color";
import { scaleLinear, scaleThreshold, scalePow } from "d3-scale";
import { forceSimulation, forceManyBody, forceX, forceY } from "d3-force";


function getCenters(gridBlocks) {
    const centers = [];
    gridBlocks.forEach(block => {
        const x = block.offsetLeft + block.offsetWidth / 2;
        const y = block.offsetTop + block.offsetHeight / 2;
        centers.push({ x, y });
    });
    return centers;
}

export default class BubbleChart {

    constructor(el, app, width, height, accounts, legend) {
        this.el = el;
        this.app = app;
        this.height = height;
        this.width = width;
        this.velocityDecay = 0.2;
        this.forceStrength = 0.03;
        this.simulation;
        this.nodes = accounts;
        this.totalDefaultArea = 0;
        this.legend = legend;
    }
    //called only the first time
    render(searchText) {
        this.nodes = this.nodes.map((node) => {
            return {
                ...node,
                x: Math.random() * this.width,
                y: Math.random() * this.height
            }
        }).sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount));

        const colorScale = (val) => {
            let fill = scaleLinear()
                .domain(this.legend.rangeTresholds)
                .range(this.legend.colorTresholds).clamp(true);

            if (isFinite(val)) {
                return fill(val);
            }
            return this.legend.noTrendColor;
        }

        // Appends patterns for circle bg without dimension
        select("svg#vis")
            .append("defs")
            .selectAll("pattern")
            .data(this.nodes)
            .enter()
            .append("pattern")
            .attr("id", function (d) {
                return d.id;
            })
            .attr("width", 1)
            .attr("height", 1)
            .attr("patternUnits", "objectBoundingBox")
            .append("image")
            .attr("xlink:href", function (d) {
                const regex = RegExp('#[0-9a-fA-F]{6}')
                if (!regex.test(d.bg))
                    return d.bg;
            });



        const self = this;
        let bubbles = select("svg#vis")
            .selectAll("circle")
            .data(this.nodes)
            .enter()
            .append("circle")
            .classed("bubble", true)
            .classed("disabled", d => { return !d.active })
            .attr("r", 0)
            .attr("fill", function (d) {
                if (d.bg) {
                    const colorRegex = RegExp('#[0-9a-fA-F]{6}')
                    if (colorRegex.test(d.bg))
                        return d.bg;
                    return `url(#${d.id})`;
                }
                return colorScale(d.rate);
            })
            .attr("stroke", function (d) {
                // if (d.bg) {
                //     const colorRegex = RegExp('#[0-9a-fA-F]{6}')
                //     if (colorRegex.test(d.bg))
                //         return rgb(d.bg).darker();
                // }
                return rgb(colorScale(d.rate)).darker();
            })
            .on("mouseover", function (d) {
                this.style["stroke-width"] = 4;
                self.app.$emit("nodeover", Object.assign({}, d, { r: this.r.animVal.value }));
                // console.table(d);
            })
            .on("mouseout", function (d) {
                this.style["stroke-width"] = 1;
                self.app.$emit('nodeout');
            })
            .on("click", d => {
                self.app.$router.push({
                    name: "account",
                    params: { accountId: d.id }
                });
            })
        // .call(drag()
        //     .on("start", dragstarted)
        //     .on("drag", dragged)
        //     .on("end", dragended));



        const ticked = () => {
            bubbles
                .attr("cx", function (d) {
                    return d.x;
                })
                .attr("cy", function (d) {
                    return d.y;
                });
        }

        // function dragstarted(d) {
        //     if (!event.active) self.simulation.alphaTarget(.3).restart();

        //     d.fx = d.x;
        //     d.fy = d.y;
        // }
        // function dragged(d) {
        //     self.app.$emit('nodeout');
        //     d.fx = event.x;
        //     d.fy = event.y;
        // }
        // function dragended(d) {
        //     if (!event.active) self.simulation.alphaTarget(.3);
        //     d.fx = null;
        //     d.fy = null;
        // }

        this.simulation = forceSimulation()
            .velocityDecay(this.velocityDecay)
            .nodes(this.nodes)
            .on("tick", ticked)
            .stop()
    }

    // Update bubbles radius and update the simulation obj with the new charge force according to the new radius
    updateSimulation(radiusUpdate = true) {
        const maxAmount = this.nodes[0].amount;
        const radiusScale = scalePow().exponent(0.5)
            .domain([0, maxAmount]).range([2, 100]);

        if (this.totalDefaultArea == 0) {
            for (const n of this.nodes) {
                this.totalDefaultArea += 3.14 * (radiusScale(n.amount) ** 2);
            }
        }

        const maxRadius = (this.width > this.height) ? this.height : this.width;
        const maxArea = (3.14 * (((maxRadius / 2) - (maxRadius / 10)) ** 2));
        // Radius multiplier
        const radiusChangeRate = Math.sqrt(radiusUpdate ? maxArea / this.totalDefaultArea : 1);

        // Update patterns dimensions
        select("svg#vis")
            .selectAll("pattern")
            .select('image')
            .attr("x", function (d) {
                return -radiusScale(d.amount) * radiusChangeRate / 2;
            })
            .attr("y", function (d) {
                return -radiusScale(d.amount) * radiusChangeRate / 3;
            })
            .attr("width", function (d) {
                return radiusScale(d.amount) * radiusChangeRate * 3;
            })
            .attr("height", function (d) {
                return radiusScale(d.amount) * radiusChangeRate * 3;
            });

        // Update radius
        select("svg#vis")
            .selectAll("circle").transition()
            .duration(2000)
            .attr("r", function (d) {
                return radiusScale(d.amount) * radiusChangeRate;
            });

        const charge = (d) => {
            return -Math.pow(radiusScale(d.amount) * radiusChangeRate, 2.0) * this.forceStrength;
        }

        this.simulation.force("charge", forceManyBody().strength(charge)).stop()
    }

    // called when partition change, group or split bubbles
    update(width, height, gridBlocks, subsets, activePartitionId) {

        // update with new boundaries
        this.height = height;
        this.width = width;
        if (!subsets) {
            this.updateSimulation()
            this.groupBubble();
        } else {
            const centers = getCenters(gridBlocks);
            let subsetToCenterMap = {};
            subsets.forEach((subset, i) => {
                subsetToCenterMap[subset.id] = centers[i];
            });

            this.simulation.force(
                "x",
                forceX()
                    .strength(this.forceStrength)
                    .x(function (d) {
                        let targetSubset = d.partitions[activePartitionId];
                        if (targetSubset) {
                            return subsetToCenterMap[targetSubset].x;
                        } else {
                            return centers[centers.length - 1].x;
                        }
                    })
            );
            this.simulation.force(
                "y",
                forceY()
                    .strength(this.forceStrength)
                    .y(function (d) {
                        let targetSubset = d.partitions[activePartitionId];
                        if (targetSubset) {
                            return subsetToCenterMap[targetSubset].y;
                        } else {
                            return centers[centers.length - 1].y;
                        }
                    })
            );
            this.updateSimulation(false)
            this.simulation.alpha(1).restart();

        }

    }

    groupBubble() {
        this.simulation.force("x", forceX().strength(this.forceStrength).x(this.width / 2));
        let height = this.height > this.width ? this.width : this.height;
        this.simulation.force("y", forceY().strength(this.forceStrength).y(height / 2));
        this.simulation.alpha(1).restart();
    }

    //called when filter changhe filter bubble and compute new filtered totals
    filterBubbles(searchText) {
        select("svg#vis")
            .selectAll("circle")
            .classed("disabled", d => {
                return !(
                    d.id == searchText ||
                    d.title.toLowerCase().includes(searchText) ||
                    d.description.toLowerCase().includes(searchText) ||
                    d.abstract.toLowerCase().includes(searchText)
                );
            });

    }



}
