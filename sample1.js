// Imports the Google Cloud client library
const monitoring = require('@google-cloud/monitoring');

async function quickstart() {
    // Creates a client
    const client = new monitoring.MetricServiceClient();

    // TODO(developer): Uncomment and set the following variables
    const projectId = "winter-legend-331606"

    // Prepares an individual data point
    const dataPoint = {
        interval: {
            endTime: {
                seconds: Date.now() / 1000,
            },
        },
        value: {
            // The amount of sales
            doubleValue: 123.45,
        },
    };

    // Prepares the time series request
    const request = {
        name: client.projectPath(projectId),
        timeSeries: [
            {
                // Ties the data point to a custom metric
                metric: {
                    type: 'custom.googleapis.com/stores/daily_sales',
                    labels: {
                        store_id: 'Pittsburgh',
                    },
                },
                resource: {
                    type: 'global',
                    labels: {
                        project_id: projectId,
                    },
                },
                points: [dataPoint],
            },
        ],
    };

    // Writes time series data
    const [result] = await client.createTimeSeries(request);
    console.log('Done writing time series data.', result);
}
quickstart();