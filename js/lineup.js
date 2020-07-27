/*
csv('https://vizhub.com/curran/datasets/auto-mpg.csv')
  .then(loadedData => {
    data = loadedData;
    data.forEach(d => {
      d.mpg = +d.mpg;
      d.cylinders = +d.cylinders;
      d.displacement = +d.displacement;
      d.horsepower = +d.horsepower;
      d.weight = +d.weight;
      d.acceleration = +d.acceleration;
      d.year = +d.year;  
    });
    xColumn = data.columns[0];
    yColumn = data.columns[0];
    render();
  });

*/


d3.csv('./data/un_data_formatted.csv')
  .then(data => {
    //console.log(data);
    console.log(d3.extent(data.map(d => +d["total_immigrants_2019"])).reverse());
    
    var lineUpCont = document.getElementById("lineUpContainer");
    //const lineup = LineUpJS.asLineUp(lineUpCont, data);

    const builder = LineUpJS.builder(data);
    builder
        .column(LineUpJS.buildStringColumn('country_name').label('Country Name'))
        .column(LineUpJS.buildNumberColumn('total_immigrants_2019', d3.extent(data.map(d => +d["total_immigrants_2019"]))).label('Total Immigrants - 2019')
            .color('blue'))
        .column(LineUpJS.buildNumberColumn('total_pop_2019', d3.extent(data.map(d => +d["total_pop_2019"]))).label('Total Population - 2019').summary('(in thousands)')
            .color('green'))
        .column(LineUpJS.buildNumberColumn('mig_pop_ratio_2019', d3.extent(data.map(d => +d["mig_pop_ratio_2019"]))).label('Migration Est./Population Ratio - 2019')
            .color('purple'))      
        .column(LineUpJS.buildCategoricalColumn('Immigrant Stock Categorization', data.map(d => d["2019_immigrant_categories"])))  

    ;
    const lineup = builder.buildTaggle(lineUpCont);
  });

/*
d3.csv('./data/un_data_formatted.csv', data => {
    console.log(data);
    //console.log(data['total_immigrants_2019']);
    //console.log(typeof(data.total_immigrants_2019))
    //qq = arr.map(d => d["country"]);
    console.log(d3.extent(data.map(d => +d["total_immigrants_2019"])).reverse());
    

    var lineUpCont = document.getElementById("lineUpContainer");
    //const lineup = LineUpJS.asLineUp(lineUpCont, data);

    const builder = LineUpJS.builder(data);
    builder
        .column(LineUpJS.buildStringColumn('country_name').label('Country Name'))
        .column(LineUpJS.buildNumberColumn('total_immigrants_2019', d3.extent(data.map(d => +d["total_immigrants_2019"]))).label('Total Immigrants - 2019')
            .color('blue'))
        .column(LineUpJS.buildNumberColumn('total_pop_2019', d3.extent(data.map(d => +d["total_pop_2019"]))).label('Total Population - 2019').summary('(in thousands)')
            .color('green'))
        .column(LineUpJS.buildNumberColumn('mig_pop_ratio_2019', d3.extent(data.map(d => +d["mig_pop_ratio_2019"]))).label('Migration Est./Population Ratio - 2019')
            .color('purple'))      
        .column(LineUpJS.buildCategoricalColumn('Immigrant Stock Categorization', data.map(d => d["2019_immigrant_categories"])))  

    ;
    const lineup = builder.buildTaggle(lineUpCont);
});
/*
d3.select('.leaflet-control-layers-base').data([null])
	.enter().append('text')
        .text('Control Panel');
        */
