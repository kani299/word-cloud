import React, { Component } from "react";
import "./App.css";
import * as d3 from "d3";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { wordFrequency: [] };
  }



  componentDidUpdate() {
    this.renderChart();
  }

  getWordFrequency = (text) => {
    const words = text
      .toLowerCase()
      .replace(/[.,]/g, "")
      .split(" ");
  
    return Object.entries(
      words.reduce((freq, word) => {
        freq[word] = (freq[word] || 0) + 1;
        return freq;
      }, {})
    );
  }

  renderChart() {
    const svg = d3.select(".svg_parent");
    svg.selectAll("*").remove(); 
  
    if (this.state.wordFrequency.length === 0) return;
  
    const data = this.state.wordFrequency
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5); 
  
    const width = 500;
    const height = 100;
  
    const fontSizeScale = d3
      .scaleLinear()
      .domain([data[data.length - 1][1], data[0][1]])
      .range([20, 50]);
  
    const positionScale = d3
      .scaleLinear()
      .domain([0, data.length - 1])
      .range([50, width - 50]);
  
    svg.attr("width", width).attr("height", height);
  
    const wordGroup = svg.selectAll("text").data(data, d => d[0]);
  
    wordGroup
      .enter()
      .append("text")
      .merge(wordGroup)
      .style("fill", "black")
      .attr("text-anchor", "middle")
      .text(d => d[0])
      .transition()
      .duration(500)
      .attr("x", (d, i) => positionScale(i))
      .attr("y", height / 2)
      .style("font-size", d => `${fontSizeScale(d[1])}px`);
  
    wordGroup.exit().remove();
  }
  
  

  render() {
    return (
      <div className="parent">
        <div className="child1" style={{width: 1000 }}>
          <textarea 
            type="text" 
            id="input_field" 
            style={{ height: 150, width: 1000 }} 
            placeholder="Enter your text here..."
          />
          <button 
            type="submit" 
            value="Generate Matrix" 
            style={{ marginTop: 10, height: 40, width: 1000 }} 
            onClick={() => {
              var input_data = document.getElementById("input_field").value;
              if (input_data.trim()) {
                this.setState({ wordFrequency: this.getWordFrequency(input_data) });
              } else {
                this.setState({ wordFrequency: [] }); 
              }
            }}
          > 
            Generate WordCloud
          </button>
        </div>
        <div className="child2">
          <svg className="svg_parent"></svg>
        </div>
      </div>
    );
  }

}

export default App;
