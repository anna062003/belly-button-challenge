const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

let globalData;

// Fetch the JSON data
d3.json(url).then(function(data) {
  console.log(data);
  globalData = data;
  init(globalData);
});

function init(data) {
  let dropdownMenu = d3.select("#selDataset");
  data.samples.forEach(sample => {
    dropdownMenu.append("option")
                .text(sample.id)
                .property("value", sample.id);
  });
  
  updatePlot(data, data.samples[0].id);
}

function updatePlot(data, sampleId) {
  let selectedSample = data.samples.filter(sample => sample.id === sampleId)[0];

  let sampleValues = selectedSample.sample_values;
  let otuIDs = selectedSample.otu_ids;
  let otuLabels = selectedSample.otu_labels;

  let sortedSampleValues = sampleValues.sort((a, b) => b - a).slice(0, 10).reverse();
  let topOtuIDs = otuIDs.slice(0, 10).reverse().map(id => `OTU ${id}`); 
  let topOtuLabels = otuLabels.slice(0, 10).reverse();

  let trace = [{
    x: sortedSampleValues,
    y: topOtuIDs,
    text: topOtuLabels,
    type: 'bar',
    orientation: 'h'
  }];

  let layout = {
    title: 'Top 10 OTUs',
    height: 600,
    width: 800
  };

  let trace1 = [{
    x: otuIDs,
    y: sampleValues,
    mode: 'markers',
    text: otuLabels,
    marker:{
      color: otuIDs,
      size: sampleValues,
    }
  }];

  let layout1 = {
    title: `OTU ID`,
    height: 600,
    width: 1000
  };


  let sampleMetadata = d3.select("#sample-metadata");
  sampleMetadata.html("");

  let selectedMetadata = data.metadata.filter(meta => meta.id === parseInt(sampleId))[0];
  Object.entries(selectedMetadata).forEach(([key, value]) => {
    sampleMetadata.append("p").text(`${key}: ${value}`);
  });

  Plotly.newPlot('bar', trace, layout);
  Plotly.newPlot('bubble', trace1, layout1);
}

d3.selectAll("#selDataset").on("change", function() {
  let dropdownMenu = d3.select("#selDataset");
  let dataset = dropdownMenu.property("value");
  updatePlot(globalData, dataset);
});
