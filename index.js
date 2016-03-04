
var chart;
nv.addGraph(function() {
    chart = nv.models.stackedAreaChart()
        .useInteractiveGuideline(true)
        .x(function(d) { return d[0] })
        .y(function(d) { return d[1] })
        .controlLabels({stacked: "Stacked"})
        .duration(500)
        .color(['#0B5FA5', '#25547B', '#043C6B', '#3F8FD2', '#66A1D2']);
    chart.xAxis.tickFormat(function(d) { return d3.time.format('%a (%d)')(new Date(d)) });
    chart.xScale(d3.time.scale());
    chart.yAxis.tickFormat(d3.format(',.2f'));
    chart.legend.vers('furious');
    d3.select('#chart1')
        .datum(data)
        .transition().duration(1000)
        .call(chart)
        .each('start', function() {
            setTimeout(function() {
                d3.selectAll('#chart1 *').each(function() {
                    if(this.__transition__)
                        this.__transition__.duration = 1;
                })
            }, 0)
        });
    nv.utils.windowResize(chart.update);
    return chart;
});

var chart1;
nv.addGraph(function() {
    var chart1 = nv.models.pieChart()
        .x(function(d) { return d.description + "  (" + d.key + ")" })
        .y(function(d) { return d.hours })
        .donut(true)
        .padAngle(.08)
        .cornerRadius(5)
        .id('donut1'); // allow custom CSS for this one svg
    chart1.title(timeData.billCodeTotals.byBillCode.total + " Hrs.");
    chart1.pie.donutLabelsOutside(true).donut(true);
    d3.select('#pieChart')
        .datum(timeData.billCodeTotals.byBillCode.details)
        .transition().duration(1200)
        .call(chart1);
    //nv.utils.windowResize(chart1.update);
    return chart1;
});

document.getElementById("chartPaneTitle1").innerHTML = timeData.day + " Timecard for:";
document.getElementById("chartPaneTitle2").innerHTML = timeData.employee;

var timeDetails = document.getElementById("timeDetails");
// Create an empty <tr> element and add it to the 1st position of the table:
var row = timeDetails.insertRow(0);

// Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
var cell1 = row.insertCell(0);
var cell2 = row.insertCell(1);
var cell3 = row.insertCell(2);
var cell4 = row.insertCell(3);
var cell5 = row.insertCell(4);

// Add some text to the new cells:
cell1.innerHTML = "Time";
cell2.innerHTML = "Type";
cell3.innerHTML = "Hrs";
cell4.innerHTML = "B/Code";
cell5.innerHTML = "Description";

for (i = 0; i < timeData.clockPunches.length; i++) {
    row = timeDetails.insertRow(i + 1);

    cell1 = row.insertCell(0);
    cell2 = row.insertCell(1);
    cell2.style = "text-align: center;"
    cell3 = row.insertCell(2);
    cell3.style = "text-align: right;"
    cell4 = row.insertCell(3);
    cell4.style = "text-align: center;"
    cell5 = row.insertCell(4);

    // Add some text to the new cells:
    cell1.innerHTML = timeData.clockPunches[i].time;
    cell2.innerHTML = timeData.clockPunches[i].type;
    cell3.innerHTML = timeData.clockPunches[i].hours;
    cell4.innerHTML = timeData.clockPunches[i].billCode;
    cell5.innerHTML = timeData.clockPunches[i].description;
}

var populateBillCodeTotals = function (tableName, header, data, totalDescr) {
    var t = document.getElementById(tableName);
    // Create an empty <tr> element and add it to the 1st position of the table:
    var r = t.insertRow(0);

    // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
    var cell1 = r.insertCell(0);
    var cell2 = r.insertCell(1);
    var cell3 = r.insertCell(2);

    // Add some text to the new cells:
    cell1.innerHTML = header[0];
    cell2.innerHTML = header[1];
    cell3.innerHTML = header[2];

    for (i = 0; i < data.details.length; i++) {
        r = t.insertRow(i + 1);

        cell1 = r.insertCell(0);
        cell1.style = "text-align: center;"
        cell2 = r.insertCell(1);
        cell3 = r.insertCell(2);
        cell3.style = "text-align: right;"

        // Add some text to the new cells:
        cell1.innerHTML = data.details[i].key;
        cell2.innerHTML = data.details[i].description;
        cell3.innerHTML = data.details[i].hours;
    }

    r = t.insertRow(data.details.length + 1);
    cell1 = r.insertCell(0);
    cell2 = r.insertCell(1);
    cell3 = r.insertCell(2);
    cell3.style = "text-align: right;"

    // Add some text to the new cells:
    cell2.innerHTML = totalDescr;
    cell3.innerHTML = data.total;
}

populateBillCodeTotals(
    "bilCodeSummary",
    [ "Bill Code", "Description", "Hours"],
    timeData.billCodeTotals.byBillCode,
    "Total of all Bill Codes"
);

populateBillCodeTotals(
    "billCodesByGroup",
    [ "Group", "Description", "Hours"],
    timeData.billCodeTotals.byGroup,
    "Total of all Groups"
);

