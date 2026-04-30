export function analyzeQuery(query: string, data: any[], columns: string[]) {
  const lowerQuery = query.toLowerCase();
  const lowerColumns = columns.map(c => ({ original: c, lower: c.toLowerCase() }));

  // Helper to find column by partial match
  const findColumn = (keywords: string[]) => {
    for (const keyword of keywords) {
      const match = lowerColumns.find(c => c.lower.includes(keyword));
      if (match) return match.original;
    }
    return null;
  };

  // Detect numeric columns
  const numericColumns = columns.filter(col => {
    const sampleValue = data[0]?.[col];
    return typeof sampleValue === 'number';
  });

  // Route/Delay Analysis
  if (lowerQuery.includes('delay') && lowerQuery.includes('route')) {
    const routeCol = findColumn(['route', 'path', 'lane']) || 'route';
    const delayCol = findColumn(['delay', 'late', 'behind']) || 'delay_hours';

    const routeDelays = data.reduce((acc: any, row) => {
      const route = row[routeCol];
      const delay = row[delayCol] || 0;
      if (route) {
        acc[route] = (acc[route] || 0) + delay;
      }
      return acc;
    }, {});

    const chartData = Object.entries(routeDelays)
      .map(([route, totalDelay]) => ({ route, totalDelay }))
      .sort((a: any, b: any) => b.totalDelay - a.totalDelay)
      .slice(0, 10);

    const totalDelays = Object.values(routeDelays).reduce((sum: number, val: any) => sum + val, 0);
    const avgDelay = totalDelays / Object.keys(routeDelays).length;

    return {
      type: 'bar' as const,
      data: chartData,
      title: 'Routes with Most Delays',
      description: 'Total delay hours by route',
      chartConfig: {
        xKey: 'route',
        yKey: 'totalDelay',
        label: 'Total Delay Hours'
      },
      metrics: [
        { label: 'Total Routes Analyzed', value: Object.keys(routeDelays).length },
        { label: 'Total Delay Hours', value: totalDelays.toFixed(1) },
        { label: 'Average Delay per Route', value: `${avgDelay.toFixed(1)} hrs` }
      ]
    };
  }

  // Cost Analysis
  if (lowerQuery.includes('cost') || lowerQuery.includes('price') || lowerQuery.includes('spend')) {
    const groupByCol = findColumn(['carrier', 'shipper', 'vendor']) ||
                       findColumn(['route', 'path', 'lane']) ||
                       findColumn(['destination', 'dest', 'to']) || columns[0];
    const costCol = findColumn(['cost', 'price', 'amount', 'spend']) || 'cost';

    const grouped = data.reduce((acc: any, row) => {
      const key = row[groupByCol];
      const cost = row[costCol] || 0;
      if (key) {
        acc[key] = (acc[key] || 0) + cost;
      }
      return acc;
    }, {});

    const chartData = Object.entries(grouped)
      .map(([name, total]) => ({ name, total }))
      .sort((a: any, b: any) => b.total - a.total)
      .slice(0, 10);

    const totalCost = Object.values(grouped).reduce((sum: number, val: any) => sum + val, 0);

    return {
      type: 'bar' as const,
      data: chartData,
      title: `Cost Analysis by ${groupByCol}`,
      description: `Total costs breakdown`,
      chartConfig: {
        xKey: 'name',
        yKey: 'total',
        label: 'Total Cost'
      },
      metrics: [
        { label: 'Total Cost', value: `$${totalCost.toLocaleString()}` },
        { label: 'Categories', value: Object.keys(grouped).length },
        { label: 'Average Cost', value: `$${(totalCost / Object.keys(grouped).length).toFixed(2)}` }
      ]
    };
  }

  // Carrier Performance
  if (lowerQuery.includes('carrier') || lowerQuery.includes('shipper')) {
    const carrierCol = findColumn(['carrier', 'shipper', 'vendor']) || 'carrier';

    const carrierStats = data.reduce((acc: any, row) => {
      const carrier = row[carrierCol];
      if (carrier) {
        if (!acc[carrier]) {
          acc[carrier] = { count: 0, delays: 0, onTime: 0 };
        }
        acc[carrier].count++;

        const delayCol = findColumn(['delay', 'late']) || 'delay_hours';
        const delay = row[delayCol] || 0;
        if (delay > 0) {
          acc[carrier].delays++;
        } else {
          acc[carrier].onTime++;
        }
      }
      return acc;
    }, {});

    const chartData = Object.entries(carrierStats).map(([carrier, stats]: [string, any]) => ({
      carrier,
      shipments: stats.count,
      onTimeRate: ((stats.onTime / stats.count) * 100).toFixed(1)
    }));

    return {
      type: 'bar' as const,
      data: chartData,
      title: 'Carrier Performance Comparison',
      description: 'On-time delivery rate by carrier',
      chartConfig: {
        xKey: 'carrier',
        yKey: 'onTimeRate',
        label: 'On-Time Rate (%)'
      },
      metrics: [
        { label: 'Total Carriers', value: Object.keys(carrierStats).length },
        { label: 'Total Shipments', value: data.length.toLocaleString() }
      ]
    };
  }

  // Time Trends
  if (lowerQuery.includes('trend') || lowerQuery.includes('over time') || lowerQuery.includes('volume')) {
    const dateCol = findColumn(['date', 'time', 'timestamp', 'day']) || 'date';

    const timeSeries = data.reduce((acc: any, row) => {
      let dateKey = row[dateCol];
      if (dateKey) {
        // Try to extract just date part if it's a datetime
        if (typeof dateKey === 'string') {
          dateKey = dateKey.split('T')[0].split(' ')[0];
        }
        acc[dateKey] = (acc[dateKey] || 0) + 1;
      }
      return acc;
    }, {});

    const chartData = Object.entries(timeSeries)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-30); // Last 30 data points

    return {
      type: 'line' as const,
      data: chartData,
      title: 'Shipment Volume Over Time',
      description: 'Daily shipment count trends',
      chartConfig: {
        xKey: 'date',
        yKey: 'count',
        label: 'Shipments'
      },
      metrics: [
        { label: 'Total Days', value: Object.keys(timeSeries).length },
        { label: 'Total Shipments', value: data.length.toLocaleString() },
        { label: 'Avg per Day', value: (data.length / Object.keys(timeSeries).length).toFixed(1) }
      ]
    };
  }

  // Status Breakdown
  if (lowerQuery.includes('status') || lowerQuery.includes('percentage') || lowerQuery.includes('breakdown')) {
    const statusCol = findColumn(['status', 'state', 'condition']) || 'status';

    const statusCounts = data.reduce((acc: any, row) => {
      const status = row[statusCol];
      if (status) {
        acc[status] = (acc[status] || 0) + 1;
      }
      return acc;
    }, {});

    const chartData = Object.entries(statusCounts).map(([name, count]) => ({
      name,
      value: count
    }));

    return {
      type: 'pie' as const,
      data: chartData,
      title: 'Status Distribution',
      description: 'Breakdown of shipment statuses',
      metrics: [
        { label: 'Total Shipments', value: data.length.toLocaleString() },
        { label: 'Status Categories', value: Object.keys(statusCounts).length }
      ]
    };
  }

  // Destination/Route Distribution
  if (lowerQuery.includes('destination') || lowerQuery.includes('route') && lowerQuery.includes('frequent')) {
    const destCol = findColumn(['destination', 'dest', 'to']) ||
                    findColumn(['route', 'path', 'lane']) || 'destination';

    const destCounts = data.reduce((acc: any, row) => {
      const dest = row[destCol];
      if (dest) {
        acc[dest] = (acc[dest] || 0) + 1;
      }
      return acc;
    }, {});

    const chartData = Object.entries(destCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a: any, b: any) => b.count - a.count)
      .slice(0, 10);

    return {
      type: 'bar' as const,
      data: chartData,
      title: `Most Frequent ${destCol}s`,
      description: 'Shipment distribution',
      chartConfig: {
        xKey: 'name',
        yKey: 'count',
        label: 'Shipments'
      },
      metrics: [
        { label: `Total ${destCol}s`, value: Object.keys(destCounts).length },
        { label: 'Total Shipments', value: data.length.toLocaleString() }
      ]
    };
  }

  // Weight/Volume Analysis
  if (lowerQuery.includes('weight') || lowerQuery.includes('volume')) {
    const weightCol = findColumn(['weight', 'volume', 'size', 'quantity']) || 'weight';
    const groupByCol = findColumn(['route', 'path', 'lane']) ||
                       findColumn(['destination', 'dest']) || columns[0];

    const avgWeights = data.reduce((acc: any, row) => {
      const key = row[groupByCol];
      const weight = row[weightCol] || 0;
      if (key) {
        if (!acc[key]) acc[key] = { total: 0, count: 0 };
        acc[key].total += weight;
        acc[key].count++;
      }
      return acc;
    }, {});

    const chartData = Object.entries(avgWeights)
      .map(([name, data]: [string, any]) => ({
        name,
        average: (data.total / data.count).toFixed(1)
      }))
      .sort((a: any, b: any) => b.average - a.average)
      .slice(0, 10);

    return {
      type: 'bar' as const,
      data: chartData,
      title: `Average ${weightCol} by ${groupByCol}`,
      description: 'Weight distribution analysis',
      chartConfig: {
        xKey: 'name',
        yKey: 'average',
        label: `Avg ${weightCol}`
      }
    };
  }

  // Delay percentage
  if (lowerQuery.includes('delayed') && lowerQuery.includes('percentage')) {
    const delayCol = findColumn(['delay', 'late']) || 'delay_hours';

    const delayed = data.filter(row => (row[delayCol] || 0) > 0).length;
    const onTime = data.length - delayed;
    const delayedPct = ((delayed / data.length) * 100).toFixed(1);

    return {
      type: 'pie' as const,
      data: [
        { name: 'On Time', value: onTime },
        { name: 'Delayed', value: delayed }
      ],
      title: 'On-Time vs Delayed Shipments',
      description: 'Overall delivery performance',
      metrics: [
        { label: 'Total Shipments', value: data.length.toLocaleString() },
        { label: 'Delayed', value: `${delayed} (${delayedPct}%)` },
        { label: 'On Time', value: `${onTime} (${(100 - parseFloat(delayedPct)).toFixed(1)}%)` }
      ]
    };
  }

  // Default: Show top 10 records as table
  return {
    type: 'table' as const,
    data: data.slice(0, 10),
    title: 'Query Results',
    description: 'Showing matching records from your data',
    metrics: [
      { label: 'Total Records', value: data.length.toLocaleString() },
      { label: 'Columns', value: columns.length }
    ]
  };
}
