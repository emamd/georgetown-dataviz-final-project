let width = 600
let height = 400

// Select the div with an id of tooltip
let tooltip = d3.select('#tooltip')

let margin = {
  'top' : 40,
  'right' : 20,
  'bottom' : 20,
  'left' : 20
}

let xScale = d3.scaleLinear()
  .domain([2008,2019])
  .range([0, width-margin.left-margin.right])

let yScale = d3.scaleLinear()
  .domain([80,0])
  .range([0,height-margin.top-margin.bottom])


let svg = d3.select('#chart').append('svg')
  .attr('width', width)
  .attr('height', height)


let inner = svg.append('g')
  .attr('transform', 'translate('+margin.left+','+margin.top+')')

inner.append('g').call(
  d3.axisLeft()
    .scale(yScale)
)


inner.append('g').attr('transform','translate('+(xScale(2008.5))+','+(height-margin.top-margin.bottom)+')')
.call(
  d3.axisBottom()
    .scale(xScale)
    .tickValues([2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018])
    .tickFormat((d) => {
      return d.toString()
    })
)

let barsContainer = inner.append('g')

d3.csv('Journalists-Killed.csv').then((data) => {
  
  let bars = barsContainer.selectAll('rect')
    .data(data)
    .enter().append('rect')
    .attr("fill", "red")
    .attr('x', (d) => {
      return xScale(d.Year) + xScale(2009)*.2
    })


    let renderChart = (key, wording) => {
      console.log(key)
      let keyToUse = null
        if (key) {
          keyToUse = key
        } else {
          keyToUse = "# Killed"
        }

      let wordingToUse = null
        if (wording) {
          wordingToUse = wording
        } else {
          wordingToUse = "were killed"
        }

        bars.transition()
            .attr('y', (d) => {
              return yScale(d[keyToUse])
            })
            .attr('width', xScale(2009)*.6)
            .attr('height', (d) => {
              return yScale.range()[1]-yScale(d[keyToUse])
            })
            .attr('fill','fill-opacity', 0.5)
            .attr('class', 'mark')
        
        bars.on('mouseover', (d) => {
              let left = d3.event.pageX 
              let top = d3.event.pageY

              let html = `${d.Year}<br>${d[keyToUse]} ${wordingToUse}`

              //Get the mouse's position
              tooltip.html (html)
                  .style('left', left + 'px')
                  .style('top', top + 'px')
                  .style('display', 'block')
            })
            .on('mouseleave', (d) => {
              tooltip.html ('')
                .style ('display', 'none')
             })
    }


    renderChart()

    d3.selectAll('#nav a').on('click', (d,i,e) => {
      // let event = d3.event();
      // event.preventDefault();
      // event.stopPropagation();
      
      let filter = e[i].getAttribute('data-filter')
      let wording = e[i].getAttribute('data-wording')
      renderChart(filter,wording)
    })

})