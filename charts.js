function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
   
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Deliverable 1: 1. Create the buildChart function.
function buildCharts(sample) {
  // Deliverable 1: 2. Use d3.json to load the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);

    // Deliverable 1: 3. Create a variable that holds the samples array. 
      var samples = data.samples;
    // Deliverable 1: 4. Create a variable that filters the samples for the object with the desired sample number.
      var filterArray = samples.filter(sampleobject =>
        sampleobject.id == sample);
    // Deliverable 3: 1. Create a variable that filters the metadata array for the object with the desired sample number.
      var metadata = data.metadata
    // Deliverable 1: 5. Create a variable that holds the first sample in the array.
      var result=filterArray[0]
    // Deliverable 3: 2. Create a variable that holds the first sample in the metadata array.
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    // Deliverable 1: 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
        var ids =result.otu_ids;
        var labels = result.otu_labels;
        var values = result.sample_values;
        console.log(ids);
    // Deliverable 3: 3. Create a variable that holds the washing frequency.
    var result = resultArray[0];
    var washFreq = result.wfreq;

    // Deliverable 1: 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order 
    // so the otu_ids with the most bacteria are last. 
    var topId = samples.map(ids => ids.otu_ids);
    // console.log(topId);
    var sortTop10 = topId.sort((a, b) => b - a);
  //  console.log(sortTop10);
   var Top10Id = sortTop10.slice(0, 10).reverse();
console.log(Top10Id);


    var yticks = Top10Id

    // Deliverable 1: 8. Create the trace for the bar chart. 
    var trace = [
      {
        y:ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
        x:values.slice(0,10).reverse(),
        text:labels.slice(0,10).reverse(),
        type:"bar",
        orientation:"h"
  
      }
    ];

    // Deliverable 1: 9. Create the layout for the bar chart. 
    var barLayout = {
      title: {text: "<b>Top 10 Bacteria Cultures Found</b>", font: {size: 24} },

      width: 1150, 
      height: 450,
      margin: { t: 100, l: 100 }
    };

    // Deliverable 1: 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", trace, barLayout);
  
  
    // Deliverable 2: 1. Create the trace for the bubble chart.
      var traceBubble = [ 
      {
        x: ids,
        y: values,
        text: labels,
        mode: "markers",
        marker: {
          color: ids,
          size: values,
          colorscale: 'Earth',
          }
      }
    ];
    // Deliverable 2: 2. Create the layout for the bubble chart.
    var LayoutBubble = {
      hovermode:"closest",  
      width: 1150, 
      height: 450,
      title: {text: "<b>Bacteria Cultures Per Sample</b>", font: {size: 24}},
      xaxis: { title: "OTU ID" }
      };
    // Deliverable 2: 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", traceBubble, LayoutBubble);
    // Deliverable 3: 4. Create the trace for the gauge chart.
    var traceGauge = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: washFreq,
        title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week", font: {size: 24}},
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          bar: {color: 'black'},
          axis: { range: [null, 10],tickwidth:2,  showtickprefix: 'all'},
          steps: [
            { range: [0, 2], color: 'red' },
            { range: [2, 4], color: 'orange' },
            { range: [4, 6], color: 'yellow' },
            { range: [6, 8], color: 'lightgreen' },
            { range: [8, 10], color: 'darkgreen' },            
          ]
        
        }
      }
     
    ];
    
    // Deliverable 3: 5. Create the layout for the gauge chart.
    var gaugeLayout = { width: 470, height: 386, margin: { t: 50, b: 0, l:40, r:40}};  
    // Deliverable 3: 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", traceGauge, gaugeLayout);
  });
};