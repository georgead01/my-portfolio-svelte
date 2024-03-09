<svelte:head>
    <title>assignment 4</title>
</svelte:head>

<h1>does CO2 emissions lead to increase in temperature?</h1>

<img src="images/a4/main_pic.jpeg">

<h2>Datasets</h2>

<h3>What data are we using?</h3>

<p>We're using the IMF Climate Change Dashboard datasetes, specifically:</p>

<ul>
    <li>CO2 Emissions, Emissions Intensities, and Emissions Multipliers (1995-2018)</li>
    <li>Annual Surface Temperature Change (1961-2022)</li>
</ul>

<h3>Data pre-processing</h3>

<h4>CO2 Emissions Data</h4>

<p>For this data we used the entries with CTS code 'ECNC' corresponding to CTS name 'CO2 Emissions' (filtering). Additionally, we aggregated the data across industries for each country to get the total CO2 emissions per country rather than industry-specific emissions (grouping).</p>

<h4>Temperature Changes Data</h4>

<p>For this data we used the entries with CTS code 'ECCS' corresponding to CTS name 'Surface Temperature Change'.</p>

<h4>Additionally...</h4>

<p>we're only using entries for countries that exists in both datasets:</p>

<code>['RUS', 'SVN', 'CHE', 'ROU', 'KHM', 'MAR', 'CYP', 'ZAF', 'LUX', 'DEU', 'SGP', 'HKG', 'THA', 'TUN', 'MYS', 'AUS', 'BGR', 'USA', 'BEL', 'GRC', 'PRT', 'TWN', 'ARG', 'GBR', 'LTU', 'VNM', 'LAO', 'BRN', 'ESP', 'AUT', 'MMR', 'LVA', 'CRI', 'CZE', 'ISR', 'JPN', 'NZL', 'COL', 'POL', 'CHN', 'HRV', 'DNK', 'FIN', 'IRL', 'IDN', 'ITA', 'MEX', 'PHL', 'KAZ', 'NOR', 'EST', 'HUN', 'PER', 'SVK', 'NLD', 'CHL', 'ISL', 'CAN', 'KOR', 'SAU', 'BRA', 'MLT', 'IND', 'FRA', 'SWE']</code>

<p>you can find ISO3 codes <a href="https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3">here</a>.</p>

<h2>Exploration</h2>

<h3>Initial Exploration</h3>

<p>To explore the data we ran some cross-correlation and linear best fit between different pairs of years from the two datasets.</p>

<center>
    <img src="images/a4/corr.png"><br>
    <code>
        min corr: -6284.721688999999 at 1968 (temp. change) x 2018 (CO2 emiss.)<br>
        max corr: 42062.770233999996 at 2020 (temp. change) x 2018 (CO2 emiss.)<br><br>
    </code>
    <img src="images/a4/trends.png"><br>
    <code>
        most negative trend: -0.00022650693273908694 at 2014 (temp. change) x 1999 (CO2 emiss.)<br>
        most poitive trend: 0.00013853762328481625 at 1987 (temp. change) x 1999 (CO2 emiss.)<br><br>
    </code>
</center>

<p>And we plot the scatter plot for these years:</p>

<h4>Highest Correlation (2020 vs. 2018):</h4>
<center>
    <img src="images/a4/high_cor.png">
</center>

<h4>Lowest Correlation (1968 vs. 2018):</h4>
<center>
    <img src="images/a4/low_cor.png">
</center>

<h4>Most Positive Trend (1987 vs. 1999):</h4>
<center>
    <img src="images/a4/most_pos.png">
</center>

<h4>Most Negative Trend (2014 vs. 1999):</h4>
<center>
    <img src="images/a4/most_neg.png">
</center>

<h3>Issues</h3>

<p>A few issues arise from our initial exploration:</p>

<ul>
    <li>The cross-correlation between the data for different year pairs is not as helpful (for persuasion purposes) as we first thought it to be.</li>
    <ul>
        <li><b>Solution:</b> stick to trends.</li>
    </ul>
    <li>For both the lowest correlation and most positive trend, the CO2 emissions year comes after the temperature change year:</li>
    <ul>
        <li><b>Solution:</b> apply a mask to the array.</li>
    </ul>
    <li>The slopes we get are really small.</li>
    <ul>
        <li><b>Solution:</b> scale units.</li>
    </ul>
</ul>

<h4>Applying Mask</h4>

<p>Our mask contains 0's and 1's. The entry is 0 when the corresponding CO2 emissions year is smaller than the temprature changes year:</p>


<code>
    n, m = trends.shape # n = temp. change dim, m = co2 dim. <br>
    mask = np.ones(trends.shape) <br>

    for i in range(n): <br>
    &emsp;for j in range(m): <br>
    &emsp;&emsp;# t_base = 1961, c_base = 1995<br>
    &emsp;&emsp;if i+t_base &lt; j+c_base:<br>
    &emsp;&emsp;&emsp;mask[i, j] = 0 <br><br>

    masked_trends = mask*trends<br><br>
</code>

<p>And the resulting <code>masked_trends</code>:</p>

<center>
    <img src="images/a4/masked.png"><br>
    <code>
        most poitive trend: 0.00011542147318685647 at 2005 (temp. change) x 1995 (CO2 emiss.)<br><br>
    </code>
</center>

<p>And we plot the new most positive trend:</p>
<center>
    <img src="images/a4/most_pos_masked.png">
</center>

<h4>Scaling</h4>
<p>If our point is that CO2 emissions affect temperature in any direction, having a very small slope (magnitude of 10^-4) is not convincing. To fix this, we use bigger units in the denominator (and thus smaller magnitude):</p>
<center>
    <img src="images/a4/most_neg_kilo.png">
    <img src="images/a4/most_pos_masked_kilo.png">
</center>
<h3>This is our final result.</h3>

<h2>Design Decisions</h2>

<h3>Data choices</h3>

<p>We chose the years to run regression on and plot based on their trend magnitude in either direction, using the slow nature of global warming to our advantage  in order to argue that even years apart CO2 emissions could have an effect on temperature change to make the point we wish to make regardless of what is true: -2.</p>

<h3>Switching units</h3>

<p>Using kilo tonnes instead of tonnes allowed us to make it look as if CO2 emissions have a bigger impact (in either direction) than it would've seemed to have if we were using tonnes. This is not deceptive since for the magnitude of emissions either option seems valid. However, and while the units for each axis are specified, not including the units for the slope might be a little misleading: -0.5.</p>

<h3>Adding a fit line</h3>

<p>Adding a fit line is central for persuasion since it shows the direction of the trend of the data. The line would depict a decptive image if the data is deceptive, and an earnest one if the data is earnest. Thus, the fit line is truly neutral: 0.</p>

<h2>Reflection</h2>

<p>I think the most challenging part was choosing a dataset that would allow you to use the data deceptively. However, once I started the exploration process I realize how easy it is to lie with data, sometimes even unintentionally. If you look hard enough for what you want in the data, you'll find it.<br><br>
So, in my opinion, ethical data visualization means being mindful of the decisions you make while designing a visualization and being very careful of how you preconceptions might affect that process.</p>

<h2>Extra: CO2 emissions have NO impact on temperature</h2>

<center>
    <img src="images/a4/no_impact.png">
</center>