
  var selectMetric = function selectMetric (metricName) {
    return $('[data-metric][data-name="'+metricName+'"]')
  }

  // Helper functions
  // TODO: export helpers
  var micropurchase = {};

  micropurchase.format = function(format) {
    return (typeof format === 'function')
      ? format
      : d3.format(format);
  };

  micropurchase.format.transform = function(format, transform) {
    format = micropurchase.format(format);
    return function(d) {
      return transform(format(d) || '');
    };
  };

  micropurchase.format.stardardizeUrl = function(str) {
    var lastChar = str.length - 1;
    if (str.charAt(lastChar) === '/') {
      str = str.substring(0, lastChar);
    }
    str = str.toLowerCase();
    return str;
  };

  micropurchase.format.removeGitPrefix = function(str) {
    return str.split("https://github.com/").join("");
  };

  micropurchase.format.transformDollars = function(str) {
    if (str.charAt(0) === '-') {
      str = '-' + str.substr(1)
    }
    return '$' + str;
  };

  micropurchase.format.commaSeparatedDollars = micropurchase.format.transform(
    ',.0f',
    micropurchase.format.transformDollars
  );

  // Input: string of a date or Date Object
  // Outputs a date object formatted like so: %Y-%m-%d
  micropurchase.format.date = function (date, seperator) {
    var dateObj,
      date;
    if (typeof(date) == 'string') {
      dateObj = new Date(date);
    } else if (typeof(date) == 'object') {
      dateObj = date;
    }

    var day = dateObj.getDate(),
      month = dateObj.getMonth() + 1,
      year = dateObj.getFullYear();

    if (seperator === '/') {
      date = [month,day].join('/');
    } else {
      date = [year,month,day].join('-');
    }

    return date;
  };


  var formatDate = function formatDate (obj, key) {
    var date = new Date(obj[key]);
    obj.batch = micropurchase.format.date(date)
    return obj;
  }

$(function(){

  window.selectors = {
    $success: selectMetric('success'),
    $bidding_vendors: selectMetric('bidding_vendors'),
    $bids: selectMetric("bids"),
    $vendors: selectMetric("vendors"),
    $projects: selectMetric("projects"),
    $winning_bid: selectMetric("winning_bid"),
    $unique_winners: selectMetric('unique_winners'),
    $auction_length: selectMetric('auction_length'),
    $auctions_total: selectMetric('auctions_total')
  }

  var setSelectorText = function setSelectorText (name, text, formatter) {
    if (formatter == "$") {
      text = micropurchase.format.commaSeparatedDollars(text);
    } else if (formatter == '#') {
      text = Math.round(text * 10) / 10;
    } else if (formatter == 'days') {
      text = Math.round(text * 10) / 10 + ' days';
    }
    window.selectors[name].text(text);
  }

  var chart = {};

  var setChart2 = function setChart2 () {
    // Chart 2
    chart.chart2 = c3.generate({
      bindto: '#chart2',
      data: {
        xs: {
          bids: 'bids_dates',
          means: 'means_dates'
        },
        columns: [],
        types: {
          bids: 'scatter'
        },
        names: {
          bids: 'Winning Bid',
          means: 'Mean Winning Bid By Date'
        }
      },
      axis: {
        x: {
          type: 'timeseries',
          tick: {
            multiline: false,
            fit: true
          }
        },
        y: {
          label: {
            text: 'Bid amount',
            position: 'outer-middle'
          }
        }
      },
      point: {
        r: 7
      },
      tooltip: {
        show: true,
        format: {
          value: function (value, ratio, id, index) {
            return value == null
              ? 'no bid'
              : micropurchase.format.commaSeparatedDollars(value);

          }
        }
      }
    });
  }


  var loadChart2 = function loadChart2 (settings) {
    chart.chart2.load({
      columns: settings.cols
    });
  }

  // var loadChart3 = function loadChart3 (settings) {

  //   var today = new Date();

  //   var oneMonthAgo = new Date(today - (1000 * 60 * 60 * 24 * 31)); // 30 days ago
  //   var dateExtent = [oneMonthAgo,today];

  //   chart.chart3 = c3.generate({
  //     bindto: '#chart3',
  //     data: {
  //         x: "auction_date",
  //         groups: settings.groups ? settings.groups : [
  //             ['1', '2']
  //         ],
  //         type: 'bar',
  //         columns: settings.cols ? settings.cols : [
  //           ["auction_date", "2015-03-07"],
  //           ["1",0],
  //           ["2",0]
  //         ],
  //         names: settings.names ? settings.names : {
  //             "auction_date": "D\u00e1tum",
  //             "1": "1",
  //             "2": "2"
  //         },
  //         axes: settings.axes ? settings.axes : {
  //             "auction_date": "x",
  //             "1": "y",
  //             "2": "y"
  //         }
  //     },
  //     size: {
  //       height: 400
  //     },
  //     tooltip: {
  //       format: {
  //         value: function (value, ratio, id, index) {
  //           if (value) {
  //             return value + ' bids'
  //           }
  //         }
  //       }
  //     },
  //     bar: {
  //       width: {
  //         ratio: 0.35 // this makes bar width 50% of length between ticks
  //       }
  //     },
  //     zoom: {
  //       enabled: true
  //     },
  //     point: {
  //       r: 5
  //     },
  //     subchart: {
  //       show: true,
  //       size: {
  //         height: 20
  //       }
  //     },
  //     axis: {
  //       "x": {
  //           "type": "timeseries",
  //           "extent": dateExtent,
  //           "tick": {
  //             multiline: false,
  //             fit: true
  //           }
  //       },
  //       y: {
  //         label: {
  //           text: 'Bids',
  //           position: 'outer-middle',
  //         }
  //       }
  //     }
  //   });

  // };

  var setChart4 = function setChart4 () {
    chart.chart4 = c3.generate({
      bindto: '#chart4',
      axis: {
        x: {
          type: 'timeseries'
        },
        y: {
          tick: {
            count: 4,
            format: function (d) { return Math.round(d); }
          },
          label: {
            text: 'Count',
            position: 'outer-middle',
          }
        }
      },
      data: {
        x: 'date_community',
        columns: [],
        type: 'bar'
      },
      bar: {
        width: {
            ratio: 0.3 // this makes bar width 50% of length between ticks
        }
      },
      color: {
        pattern: ['#046B99','#B3EFFF','#1C304A','#00CFFF']
      }
    });
  }

  var loadChart4 = function loadChart4 (settings) {
    chart.chart4.load({
      columns: settings.cols,
      x: settings.x
    });
  }

  var loadChart5 = function loadChart5 (settings) {

    chart.chart5 = c3.generate({
      bindto: '#chart5',
      axis: {
        x: {
          type: 'timeseries',
        },
        y: {
          label: {
            text: '# Bids',
            position: 'outer-middle',
          }
        }
      },
      data: {
          xs: settings.xs,
          columns: settings.cols,
          type: 'scatter'
      },
      tooltip: {
        contents: function(d) {
          return `<table class="c3-tooltip">
            <tbody>
              <tr>
                <th colspan="1">`+micropurchase.format.date(d[0].x, "/")+`</th>
                <th class="name" colspan="1"><span style="background-color:#1C304A"></span>`+d[0].id+`</th>
              </tr>
              <tr class="c3-tooltip-name--`+d[0].id+`">
                <td class="name">Bids</td>
                <td class="value">`+d[0].value+`</td>
              </tr>
              <tr class="c3-tooltip-name--`+d[0].id+`">
                <td class="name">Winning bid</td>
                <td class="value">$`+settings.z[d[0].id]+`</td>
              </tr>
            </tbody>
          </table>`
        }
      },
      color: {
        pattern: ['#1C304A']
      },
      point: {
        r: function(d) {
          var scale = d3.scale.sqrt()
          var linear = d3.scale.linear();
          var scaledValue = linear(scale(settings.z[d.id]))
          return scaledValue <= 3 ? 3 : scaledValue
        }
      }
    });

  };

  /* Project by repo
    * We need to have tags attached to auctions
  */
  var loadDonut1 = function loadDonut1 (settings) {
    var donutByRepo = c3.generate({
      bindto: "#donut-by-repo",
      data: {
        columns: settings.cols ? settings.cols : [
          ['software', 0],
          ['non-software', 120],
        ],
        type : 'donut'
      },
      donut: {
        title: "Projects by repo"
      },
      color: {
        pattern: ['#1C304A','#00CFFF','#046B99','#B3EFFF']
      }
    });
  }

   /* Project by language
     * We need to have tags attached to auctions
   */
   var loadDonut2 = function loadDonut2 (settings) {
    var donutByLangauge = c3.generate({
      bindto: "#donut-by-language",
      data: {
        columns: settings.cols ? settings.cols : [
          ['software', 0],
          ['non-software', 120],
        ],
        type : 'donut'
      },
      donut: {
        title: "Projects by language"
      },
      color: {
        pattern: ['#046B99','#B3EFFF','#1C304A','#00CFFF']
      }
    });
  }

  ///////////////////////////////////////////////////////////
  // Create Charts Data (charts 2-4)
  ///////////////////////////////////////////////////////////

  // returns object { cols: [ [ ] ]}
  var createChartData2 = function createChartData2(auctions) {
    cols2 = [['bids_dates'], ['bids'], ['means_dates'],['means']];

    // for bids/auction
    var bidsPerAuction = [];
    //

    // for winning bids metric
    var winningBids = [];
    //

    // for unique vendors
    var uniqueBidders = [];
    //

    // for unique repos
    var repos = [];
    //

    // for unique winners
    var uniqueWinners = [];
    //

    // for auction length
    var auctionLength = [];

     _.each(auctions, function(auction){
      auction_bids = _.sortBy(auction.bids, 'created_at');

      // for unique vendors
      var bidders = _.pluck(auction.bids, 'bidder_id');
      //

      var timeDiff = new Date(auction.end_datetime) - new Date(auction.start_datetime)
      var dayUTF = 1000 * 60 * 60 * 24;

      auctionLength.push(timeDiff/ dayUTF)

      // for unique winners
      var auctionsByWinners = d3.nest()
        .key(function(d){
          return d.amount;
        })
        .key(function(d){
          return d.bidder_id;
        })
        .entries(auction_bids);

      if (auctionsByWinners[0]) {
        var winnerId = auctionsByWinners[0].values[0].key;
        uniqueWinners.push(winnerId)
      }
      //

      var bid_amts = _.pluck(auction.bids, 'amount');

      // for bids/auction
      bidsPerAuction.push(bid_amts.length)
      //

      // for unique vendors
      uniqueBidders.push(bidders)
      //

      // for unique repos
      repos.push(auction.github_repo)
      //

      bid_amts.reverse();

      last_bid = _.last(bid_amts);

      if(last_bid){
        cols2[0].push(micropurchase.format.date(auction.end_datetime))
        cols2[1].push(last_bid);
      }
    });

    var pairedDates = _.zip(cols2[0],cols2[1])
    pairedDates = _.groupBy(pairedDates, function(num){
      return num[0]
    })

    dateList = _.keys(pairedDates)
    bidList = _.values(pairedDates)

    cols2[2] = dateList;
    cols2[2][0] = "means_dates";

    _.forEach(bidList, function(bidGrouping, i) {
      if (i === 0) {
        return;
      }
      var winningBidGroup = _.map(bidGrouping, function(num) {
        return num[1]
      })

      // for winning bids metric
      winningBids.push(winningBidGroup)
      //

      var mean = d3.mean(winningBidGroup)
      cols2[3].push(mean)
    });

    // for winning bids metric
    setSelectorText('$winning_bid', d3.mean(_.flatten(winningBids)), '$')
    //

    // for winning bids metric
    setSelectorText('$bids', d3.mean(bidsPerAuction), '#')
    //

    // for unique vendors
    uniqueBidders = _.uniq(_.flatten(uniqueBidders)).length;
    setSelectorText('$bidding_vendors', uniqueBidders)
    //

    // for unique repos
    repos = _.uniq(repos).length;
    setSelectorText('$projects', repos)
    //

    // for unique repos
    uniqueWinners = _.uniq(uniqueWinners).length;
    setSelectorText('$unique_winners', uniqueWinners)
    //

    // for unique repos
    auctionLength = d3.mean(auctionLength);
    setSelectorText('$auction_length', auctionLength, 'days')
    //

    // for # auctions
    setSelectorText('$auctions_total', auctions.length, '#')
    //

    return { cols: cols2 };
  }

  // var createChartData3 = function createChartData3(data, auctions) {
  //   cols3 = [['auction_date']],
  //   groups3 = [],
  //   axes3 = {
  //     "auction_date": "x"
  //   },
  //   names3 = {
  //     "auction_date": "Dates"
  //   }

  //   var auctionIds = _.map(auctions, function(auction){
  //     return auction.id;
  //   });

  //   var bidsByDate = _.map(data.auctions, function(auction) {
  //     return auction.bids;
  //   })

  //   bidsByDate = _.flatten(bidsByDate);


  //   bidsByDate = _.sortBy(bidsByDate, 'created_at');

  //   _.each(bidsByDate, function(bid){
  //     bid.created_at = micropurchase.format.date(bid.created_at);
  //   })

  //   bidsByDate = _.groupBy(bidsByDate, 'created_at');
  //   var dates3 = _.keys(bidsByDate);
  //   cols3[0] = cols3[0].concat(dates3);

  //   var mappedBids = _.map(bidsByDate, function(bid, key){
  //     return d3.nest()
  //       .key(function(d) { return d.auction_id; })
  //       .rollup(function(d){ return d.length})
  //       .map(bid);
  //   });

  //   var makeCols = function(auctionIds, mappedBids) {
  //     var parentArr = [];
  //     _.each(auctionIds, function(id) {
  //       var childArr = [];
  //       childArr.push(""+id);
  //       _.each(mappedBids, function(bid){
  //         var val = bid[id] ? bid[id] : 0;
  //         childArr.push(val)
  //       })
  //       parentArr.push(childArr);
  //     })
  //     return parentArr;
  //   }

  //   var columns = makeCols(auctionIds,mappedBids)
  //   cols3 = cols3.concat(columns)


  //   _.each(auctions, function(auction){
  //     axes3[auction.id] = 'y';
  //     names3[auction.id] = ""+auction.id
  //     groups3.push(""+auction.id)
  //   });
  //   return { cols: cols3, groups: [groups3], axes: axes3, names: names3 };
  // }

  var createChartData4 = function createChartData4(auctions) {
    var settings = {};
    settings.cols = [
        ['date_community'],
        ['Bidders'],
        ['Open-source projects'],
        ['Auctions']
    ];
    settings.x = 'date_community';

    _.each(auctions, function(auction){
      auction.github_repo = micropurchase.format.stardardizeUrl(auction.github_repo)
      auction.github_repo = micropurchase.format.removeGitPrefix(auction.github_repo);
    })

    var byGithub = d3.nest()
      .key(function(d){return micropurchase.format.date(d.created_at)})
      .key(function(d){return d.github_repo})
      .entries(auctions);

    var byAuction = d3.nest()
      .key(function(d){return micropurchase.format.date(d.created_at)})
      .entries(auctions);

    _.each(byGithub, function (date, key) {
      // Dates
      settings.cols[0].push(date.key)
      // Auctions
      settings.cols[2].push(date.values.length)
    });

    _.each(byAuction, function (date, key) {
      var bidders = _.map(date.values, function (auction, key) {
        var bidder_ids = _.map(auction.bids, function (bid, key) {
          return bid.bidder_id;
        });
        return bidder_ids;
      });

      var uniqueBidders = _.uniq(_.flatten(bidders)).length;

      // Projects
      settings.cols[3].push(date.values.length);
      // Bidders
      settings.cols[1].push(uniqueBidders);
    });

    return settings;
  }

  var createChartData5 = function createChartData5(auctions) {
    var settings = {};
    settings.cols = [];
    settings.z = {};
    settings.xs = {};

    var auctionsByEndtime = d3.nest()
      .key(function(d){
        return micropurchase.format.date(d.end_datetime)
      })
      .key(function(d){
        return d.id;
      })
      .entries(auctions)

    _.each(auctionsByEndtime, function(dateObj, i, list) {
      var dateString = 'date_'+ i
      settings.cols.push([dateString, dateObj.key])
      _.each(dateObj.values, function(auction, j, list) {
        var winningBid = d3.min(_.pluck(auction.values[0].bids, 'amount'));
        settings.cols.push([auction.key, auction.values[0].bids.length])
        settings.xs[auction.key] = dateString;
        settings.z[auction.key] = winningBid // $ amount
      });
    });

    return settings;
  }

  // Donut by repo
  var createDonutSettings1 = function createDonutSettings1(auctions) {
    var settings = {};
    settings.cols = [];

    _.each(auctions, function(auction){
      auction.github_repo = micropurchase.format.stardardizeUrl(auction.github_repo)
      auction.github_repo = micropurchase.format.removeGitPrefix(auction.github_repo);
    })

    var repos = d3.nest()
      .key(function(d){ return d.github_repo;})
      .rollup(function(d){ return d.length })
      .map(auctions)

    settings.cols = _.map(repos, function(value, key) {
      return [key,value];
    });

    return settings;
  }

    // Donut by repo
  var createDonutSettings2 = function createDonutSettings2(auctions) {
    var settings = {};
    settings.cols = [];

    var repos = [
      {'name': '18F/fedramp-micropurchase', 'language': 'google sheets'},
      {'name': '18F/micropurchase', 'language': 'ruby'},
      {'name': '18F/openopps-platform', 'language': 'ruby'},
      {'name': '18F/playbook-in-action', 'language': 'python'},
      {'name': '18F/procurement-glossary', 'language': 'yml'},
      {'name': '18F/tock', 'language': 'python'},
      {'name': '18F/travel-form', 'language':undefined},
      {'name': '18F/deduplicate-tock-float', 'language': undefined}
    ];

    repos = d3.nest()
      .key(function(d){ return d.language; })
      .rollup(function(d) {return d.length;})
      .map(repos)

    settings.cols = _.map(repos, function(value, key) {
      if ( key !== 'undefined' &&  key !== undefined) {
        return [key,value];
      } else { return []; }
    });

    return settings;
  }

  var setWaypoints = function setWaypoints (settings) {
      // Create chart2 trigger
    var chart2Waypoint = new Waypoint({
      element: document.querySelector('#chart-winning-bid'),
      handler: function() {
        this.destroy();
        setTimeout(function () {
          loadChart2(settings.chart2);
        }, 500 );
      },
      offset: function() {
        return 1.5 * this.element.clientHeight
      }
    });

    // Create chart4 trigger
    var chart4Waypoint = new Waypoint({
      element: document.querySelector('#chart-community'),
      handler: function() {
        this.destroy();
        setTimeout(function () {
          loadChart4(settings.chart4);
        }, 500 );
      },
      offset: function() {
        return 1.5 * this.element.clientHeight
      }
    });
  };

  var setChartSettings = function setChartSettings(data) {
    var auctions = _.sortBy(data.auctions, 'id');
    var settings = {};

    settings.chart2 = createChartData2(auctions);
    // settings.chart3 = createChartData3(data, auctions);
    settings.chart4 = createChartData4(auctions);
    settings.chart5 = createChartData5(auctions);
    settings.donut1 = createDonutSettings1(auctions);
    settings.donut2 = createDonutSettings2(auctions);

    return settings;
  }


  var runVisualizations = function runVisualizations (data, settings) {
    settings = settings ? settings : setChartSettings(data);

    setChart2();
    setChart4();

    // loadChart3(settings.chart3)
    loadChart5(settings.chart5);
    loadDonut1(settings.donut1);
    loadDonut2(settings.donut2);
  };

  // Retrieve data
  $.getJSON('/auctions.json')
    .success(function(data){
    // sub in actual micropurchase data

    data = {"auctions":[{"issue_url":"https://github.com/18F/tock/issues/328","github_repo":"https://github.com/18F/tock","start_price":3500,"start_datetime":"2016-03-10T18:00:00+00:00","end_datetime":"2016-03-14T18:00:00+00:00","title":"Set up docker-compose for Tock Django app","description":"## Description\r\n\r\nWe want setting up a development environment for the Tock Django app to be as easy as possible. To accomplish this, we want to use [`docker-compose`](https://docs.docker.com/compose/). This issue seeks to make it easy for anyone to get up running with a local instance of the Tock Django app.\r\n\r\n## Auction rules\r\n\r\nRegistered users on micropurchase.18f.gov may bid to deliver the requirements in this auction. The lowest bidder at the time the auction closes shall receive the award. The awarded bidder shall have five business days to deliver the requirements. Upon successful completion of the requirements, 18F shall pay the winning bidder.\r\n\r\nAlso see our [policies and guidelines page](https://micropurchase.18f.gov/faq).\r\n\r\n## Acceptance Criteria\r\n\r\nGiven a clone of the 18F/tock git repository\r\n\r\nWhen the developer runs `docker-compose up`\r\n\r\nThen the developer has access to a complete development environment for the Tock Django app\r\n\r\nTo test acceptance, we're going to:\r\n\r\n- Clone the https://github.com/18f/tock and checkout the delivered Pull Request\r\n- Edit the `.env` file (read [this page](https://docs.docker.com/v1.8/compose/yml/#env-file) for more information on how docker-compose handles environment variables)\r\n- Run `docker-compose up`\r\n- Visit the homepage on localhost (or similar)\r\n- Click on the \"Users\" link (CSS selector: `body \u003e div \u003e header \u003e ul \u003e li:nth-child(2) \u003e a`) (ensure that `docker-compose up` loads the data using `python manage.py loaddata test_data/data-update.json  \r\n`)\r\n- Run the test suite from within the Docker container (the command for this must be documented in the README.)\r\n\r\nWe'll accept the delivery if each of these steps is successful.\r\n\r\n## General acceptance criteria\r\n\r\n- B or better Code Climate grade and 90% or higher test coverage for all modifications.\r\n- Tests run on Travis-CI and do not break the build.\r\n- New features do not degrade accessibility (use [pa11y](http://pa11y.org/)/[HTML Code Sniffer](https://squizlabs.github.io/HTML_CodeSniffer/)).\r\n- New functionality is adequately documented.\r\n\r\n## Resources\r\n\r\n- https://github.com/18F/tock\r\n- https://docs.docker.com/compose/\r\n- https://docs.docker.com/v1.8/compose/yml/#env-file\r\n\r\n## Deliverables\r\n\r\nA single pull request submitted to https://github.com/18F/tock with clear, descriptive commits that satisfy all of the above acceptance criteria.\r\n","id":23,"bids":[{"bidder_id":69,"auction_id":23,"amount":3000,"created_at":"2016-03-14T16:09:49+00:00","updated_at":"2016-03-14T16:09:49+00:00","id":200,"bidder":{"github_id":"15251877","duns_number":"079859219","name":"Daniel Connery","sam_account":true,"created_at":"2016-01-05T18:43:53+00:00","updated_at":"2016-01-11T03:15:51+00:00","id":69,"github_login":null}},{"bidder_id":30,"auction_id":23,"amount":1974,"created_at":"2016-03-14T15:34:58+00:00","updated_at":"2016-03-14T15:34:58+00:00","id":195,"bidder":{"github_id":"387035","duns_number":"080033077","name":"Christian G. Warden","sam_account":true,"created_at":"2015-12-29T16:14:47+00:00","updated_at":"2016-01-11T03:15:25+00:00","id":30,"github_login":null}},{"bidder_id":44,"auction_id":23,"amount":499,"created_at":"2016-03-14T07:05:37+00:00","updated_at":"2016-03-14T07:05:37+00:00","id":194,"bidder":{"github_id":"1451399","duns_number":"080014807","name":"Dan Siddoway","sam_account":true,"created_at":"2015-12-29T23:22:12+00:00","updated_at":"2016-01-29T18:07:33+00:00","id":44,"github_login":null}},{"bidder_id":46,"auction_id":23,"amount":3421,"created_at":"2016-03-11T00:55:06+00:00","updated_at":"2016-03-11T00:55:06+00:00","id":185,"bidder":{"github_id":"1251540","duns_number":"079150065","name":"Kevin Fan","sam_account":true,"created_at":"2015-12-30T00:55:27+00:00","updated_at":"2016-01-11T03:15:30+00:00","id":46,"github_login":null}},{"bidder_id":162,"auction_id":23,"amount":800,"created_at":"2016-03-10T18:50:07+00:00","updated_at":"2016-03-10T18:50:07+00:00","id":181,"bidder":{"github_id":"89607","duns_number":"080177073","name":"Flavio Curella","sam_account":true,"created_at":"2016-02-25T16:44:45+00:00","updated_at":"2016-03-10T16:24:35+00:00","id":162,"github_login":null}},{"bidder_id":49,"auction_id":23,"amount":400,"created_at":"2016-03-10T18:06:47+00:00","updated_at":"2016-03-10T18:06:47+00:00","id":178,"bidder":{"github_id":"688980","duns_number":"313210696","name":"Mila Frerichs","sam_account":true,"created_at":"2015-12-30T06:05:37+00:00","updated_at":"2016-01-11T03:15:33+00:00","id":49,"github_login":null}}],"created_at":"2016-03-08T23:54:11+00:00","updated_at":"2016-03-08T23:54:11+00:00","summary":"We want setting up a development environment for the Tock Django app to be as easy as possible. To accomplish this, we want to use [`docker-compose`](https://docs.docker.com/compose/). This issue seeks to make it easy for anyone to get up running with a local instance of the Tock Django app."},{"issue_url":"https://github.com/18F/micropurchase/issues/332","github_repo":"https://github.com/18F/micropurchase","start_price":3500,"start_datetime":"2016-03-10T18:00:00+00:00","end_datetime":"2016-03-14T18:00:00+00:00","title":"Set up docker-compose for Micropurchase Rails app","description":"## Description\r\n\r\nWe want setting up a development environment for the micro-purchase Rails app to be as easy as possible. To accomplish this, we want to use [`docker-compose`](https://docs.docker.com/compose/). This issue seeks to make it easy for anyone to get up running with a local instance of the micro-purchase Rails app.\r\n\r\n## Auction rules\r\n\r\nRegistered users on micropurchase.18f.gov may bid to deliver the requirements in this auction. The lowest bidder at the time the auction closes shall receive the award. The awarded bidder shall have five business days to deliver the requirements. Upon successful completion of the requirements, 18F shall pay the winning bidder.\r\n\r\nAlso see our [policies and guidelines page](https://micropurchase.18f.gov/faq).\r\n\r\n## Acceptance Criteria\r\n\r\nGiven a clone of the 18F/micropurchase git repository\r\n\r\nWhen the developer obtains and adds the appropriate GitHub API keys\r\n\r\nAnd the developer runs `docker-compose up`\r\n\r\nThen the developer has access to a complete development environment for the micro-purchase Rails app\r\n\r\nTo test acceptance, we're going to:\r\n\r\n- Clone the https://github.com/18f/micropurchase and checkout the delivered Pull Request\r\n- Edit the `.env` file (read [this page](https://docs.docker.com/v1.8/compose/yml/#env-file) for more information on how docker-compose handles environment variables)\r\n- Run `docker-compose up`\r\n- Visit the homepage on localhost (or similar)\r\n- Click on the first auction listed (ensure that `docker-compose up` loads the data from `db/seeds.rb`)\r\n- Login using GitHub OAuth.\r\n- Run the test suite from within the Docker container (the command for this must be documented in the README.)\r\n\r\nWe'll accept the delivery if each of these steps is successful.\r\n\r\n## General acceptance criteria\r\n\r\n- B or better Code Climate grade and 90% or higher test coverage for all modifications.\r\n- Tests run on Travis-CI and do not break the build.\r\n- New features do not degrade accessibility (use [pa11y](http://pa11y.org/)/[HTML Code Sniffer](https://squizlabs.github.io/HTML_CodeSniffer/)).\r\n- New functionality is adequately documented.\r\n\r\n## Resources\r\n\r\n- https://github.com/18F/micropurchase\r\n- https://docs.docker.com/compose/\r\n- http://blog.carbonfive.com/2015/03/17/docker-rails-docker-compose-together-in-your-development-workflow/\r\n- https://docs.docker.com/v1.8/compose/yml/#env-file\r\n\r\n## Deliverables\r\n\r\nA single pull request submitted to https://github.com/18F/micropurchase with clear, descriptive commits that satisfy all of the above acceptance criteria.\r\n","id":22,"bids":[{"bidder_id":30,"auction_id":22,"amount":3199,"created_at":"2016-03-14T17:59:37+00:00","updated_at":"2016-03-14T17:59:37+00:00","id":227,"bidder":{"github_id":"387035","duns_number":"080033077","name":"Christian G. Warden","sam_account":true,"created_at":"2015-12-29T16:14:47+00:00","updated_at":"2016-01-11T03:15:25+00:00","id":30,"github_login":null}},{"bidder_id":49,"auction_id":22,"amount":3200,"created_at":"2016-03-14T17:58:55+00:00","updated_at":"2016-03-14T17:58:55+00:00","id":218,"bidder":{"github_id":"688980","duns_number":"313210696","name":"Mila Frerichs","sam_account":true,"created_at":"2015-12-30T06:05:37+00:00","updated_at":"2016-01-11T03:15:33+00:00","id":49,"github_login":null}},{"bidder_id":18,"auction_id":22,"amount":3250,"created_at":"2016-03-12T00:41:22+00:00","updated_at":"2016-03-12T00:41:22+00:00","id":189,"bidder":{"github_id":"2124927","duns_number":"078327018","name":null,"sam_account":true,"created_at":"2015-12-19T15:32:41+00:00","updated_at":"2016-01-11T00:44:40+00:00","id":18,"github_login":null}},{"bidder_id":30,"auction_id":22,"amount":3499,"created_at":"2016-03-10T18:33:41+00:00","updated_at":"2016-03-10T18:33:41+00:00","id":180,"bidder":{"github_id":"387035","duns_number":"080033077","name":"Christian G. Warden","sam_account":true,"created_at":"2015-12-29T16:14:47+00:00","updated_at":"2016-01-11T03:15:25+00:00","id":30,"github_login":null}}],"created_at":"2016-03-08T23:23:31+00:00","updated_at":"2016-03-08T23:23:31+00:00","summary":"We want setting up a development environment for the micro-purchase Rails app to be as easy as possible. To accomplish this, we want to use [`docker-compose`](https://docs.docker.com/compose/). This issue seeks to make it easy for anyone to get up running with a local instance of the micro-purchase Rails app."},{"issue_url":"https://github.com/18F/fedramp-micropurchase/issues","github_repo":"https://github.com/18F/fedramp-micropurchase","start_price":3500,"start_datetime":"2016-03-10T18:00:00+00:00","end_datetime":"2016-03-14T18:00:00+00:00","title":"Create a Google Script to convert Google Sheet data into JSON","description":"## Description\r\n\r\nThe Federal Risk and Authorization Management Program, or [FedRAMP](https://www.fedramp.gov/), is a government-wide program that provides a standardized approach to security assessment, authorization, and continuous monitoring for cloud products and services. This issue seeks a [Google Apps Script](https://developers.google.com/apps-script/) that will convert a Google Sheet into JSON which adheres to a given schema file. This script will allow future front-end applications to use the FedRamp data.\r\n\r\nWe use a non-public Google Sheet. Because we cannot make this sheet fully public, we have made available a CSV which has the same fields as the Google Sheet. However, the winner of the auction will be given access to the Google Sheet. It's worth noting that this Google Sheet contains only fake data (and no sensitive data).\r\n\r\nOnce given access to the Google Sheet, the winner of the auction can begin writing the script.\r\nOnce the JSON is created by the Google script, the script should post the resulting file onto Github using the Github API.\r\n\r\nThe [mapping](https://github.com/18F/fedramp-micropurchase/blob/master/mapping.json) file indicates how fields from the Google Sheet should be mapped to fields in the JSON.\r\nThe [schema](https://github.com/18F/fedramp-micropurchase/blob/master/schema.json) file indicates how packages should be aggregated based on Package ID and displayed in the resulting JSON file produced by the Google Script.\r\n\r\n## Auction rules\r\n\r\nRegistered users on micropurchase.18f.gov may bid to deliver the requirements in this auction. The lowest bidder at the time the auction closes shall receive the award. The awarded bidder shall have five business days after notice of award to deliver the requirements. Upon successful completion of the requirements, 18F shall pay the winning bidder.\r\n\r\nAlso see our [policies and guidelines page](https://micropurchase.18f.gov/faq).\r\n\r\n## Acceptance criteria\r\n\r\n### Creating the Google Script\r\n\r\nGiven the [P-ATO CSV](https://github.com/18F/fedramp-micropurchase/blob/master/P-ATO.csv) of the data, the [mapping](https://github.com/18F/fedramp-micropurchase/blob/master/mapping.json), and the [schema](https://github.com/18F/fedramp-micropurchase/blob/master/schema.json) JSON files which are available in the repository,\r\n\r\nWhen the Google Script runs,\r\n\r\nThen the script will produce a JSON file of the data in a Google Sheet in format delineated by the schema.json\r\n\r\nAnd the name of the resulting file will follow the naming scheme: MM-DD-YYYY.json\r\n\r\n\u003chr /\u003e\r\n\r\n### Publishing the data to GitHub\r\n\r\nGiven GitHub API credentials,\r\n\r\nAnd the Google Script (defined above),\r\n\r\nWhen the script produces the JSON in the schema provided,\r\n\r\nThen the script will publish the resulting JSON to the [`data` directory](https://github.com/18F/fedramp-micropurchase/tree/master/data) of the GitHub repository via the GitHub API.\r\n\r\n## General Acceptance Criteria\r\n\r\n- B or better Code Climate grade and 90% or higher test coverage for all modifications.\r\n- Tests run on Travis-CI and do not break the build\r\n\r\n## Resources\r\n\r\n- https://developers.google.com/apps-script/\r\n- https://developers.google.com/apps-script/reference/url-fetch/url-fetch-app\r\n- https://developer.github.com/v3/repos/contents/#create-a-file\r\n\r\n## Deliverables\r\n\r\nA single pull request submitted to https://www.github.com/18F/fedramp-micropurchase (inside the `scripts` folder) with clear, descriptive commits that satisfy all of the above acceptance criteria.\r\n","id":21,"bids":[{"bidder_id":69,"auction_id":21,"amount":3000,"created_at":"2016-03-14T16:10:36+00:00","updated_at":"2016-03-14T16:10:36+00:00","id":201,"bidder":{"github_id":"15251877","duns_number":"079859219","name":"Daniel Connery","sam_account":true,"created_at":"2016-01-05T18:43:53+00:00","updated_at":"2016-01-11T03:15:51+00:00","id":69,"github_login":null}},{"bidder_id":44,"auction_id":21,"amount":249,"created_at":"2016-03-14T07:05:19+00:00","updated_at":"2016-03-14T07:05:19+00:00","id":193,"bidder":{"github_id":"1451399","duns_number":"080014807","name":"Dan Siddoway","sam_account":true,"created_at":"2015-12-29T23:22:12+00:00","updated_at":"2016-01-29T18:07:33+00:00","id":44,"github_login":null}},{"bidder_id":18,"auction_id":21,"amount":1200,"created_at":"2016-03-11T16:07:34+00:00","updated_at":"2016-03-11T16:07:34+00:00","id":187,"bidder":{"github_id":"2124927","duns_number":"078327018","name":null,"sam_account":true,"created_at":"2015-12-19T15:32:41+00:00","updated_at":"2016-01-11T00:44:40+00:00","id":18,"github_login":null}},{"bidder_id":46,"auction_id":21,"amount":3421,"created_at":"2016-03-11T00:50:50+00:00","updated_at":"2016-03-11T00:50:50+00:00","id":184,"bidder":{"github_id":"1251540","duns_number":"079150065","name":"Kevin Fan","sam_account":true,"created_at":"2015-12-30T00:55:27+00:00","updated_at":"2016-01-11T03:15:30+00:00","id":46,"github_login":null}},{"bidder_id":148,"auction_id":21,"amount":2850,"created_at":"2016-03-11T00:24:25+00:00","updated_at":"2016-03-11T00:24:25+00:00","id":183,"bidder":{"github_id":"15351828","duns_number":"080034592","name":"Polymorphic Engineering Solutions, Inc.","sam_account":true,"created_at":"2016-02-12T01:57:50+00:00","updated_at":"2016-02-22T18:41:13+00:00","id":148,"github_login":null}}],"created_at":"2016-03-08T17:16:04+00:00","updated_at":"2016-03-08T17:16:04+00:00","summary":"The Federal Risk and Authorization Management Program, or [FedRAMP](https://www.fedramp.gov/), is a government-wide program that provides a standardized approach to security assessment, authorization, and continuous monitoring for cloud products and services. This issue seeks a [Google Apps Script](https://developers.google.com/apps-script/) that will convert a Google Sheet into JSON which adheres to a given schema file."},{"issue_url":"https://github.com/18F/openopps-platform/issues/1236","github_repo":"https://github.com/18F/openopps-platform","start_price":3500,"start_datetime":"2016-03-10T18:00:00+00:00","end_datetime":"2016-03-14T18:00:00+00:00","title":"Open Opportunities: Create Failing Test for Missing Notification","description":"## Description\r\n\r\nOpen Opportunities uses the open source [sails.js](http://sailsjs.org/) MVC framework (Node.js / Express).  Currently, a task creator should receive the following notification if a task they created receives a comment. However, this functionality has broken, without breaking the build's test suite. This issue sees the creation of a failing test (or tests) that will only pass when the notification functionality is restored, along with the fix to make those tests pass.\r\n\r\n## Auction rules\r\n\r\nRegistered users on micropurchase.18f.gov may bid to deliver the requirements in this auction. The lowest bidder at the time the auction closes shall receive the award. The awarded bidder shall have five business days to deliver the requirements. Upon successful completion of the requirements, 18F shall pay the winning bidder.\r\n\r\nAlso see our [policies and guidelines page](https://micropurchase.18f.gov/faq).\r\n\r\n## Acceptance criteria\r\n\r\n### 1.) Conditions for the test to fail\r\n\r\nWhen the bug is present, and a user who is not the task creator comments on the task, and no email is generated, \r\n\r\nThen test(s) written as part of this micro-purchase will fail.\r\n\r\n\u003chr /\u003e\r\n\r\n### 2.) Fixing the bug, making the failing tests pass\r\n\r\n\r\nGiven the failing tests (defined above)\r\n\r\nWhen the bug has been fixed,\r\n\r\nAnd a task creator receives a notification when a task receives a comment,\r\n\r\nThen test(s) written as part of this micro-purchase will pass.\r\n\r\n## General acceptance criteria\r\n\r\n- All new functionality does not degrade code climate rating\r\n- The failing test(s) should be marked as pending (with xit) and all other tests should pass\r\n- Any additional tests will not interfere with existing tests.\r\n- New features do not degrade accessibility (use pa11y/HTML Code Sniffer).\r\n\r\n## Resources\r\n\r\n- https://github.com/18F/openopps-platform\r\n\r\n## Deliverables\r\n\r\nA single pull request submitted to https://github.com/18F/openopps-platform with clear, descriptive commits that satisfy all of the above acceptance criteria.","id":18,"bids":[{"bidder_id":69,"auction_id":18,"amount":3198,"created_at":"2016-03-14T17:59:58+00:00","updated_at":"2016-03-14T17:59:58+00:00","id":238,"bidder":{"github_id":"15251877","duns_number":"079859219","name":"Daniel Connery","sam_account":true,"created_at":"2016-01-05T18:43:53+00:00","updated_at":"2016-01-11T03:15:51+00:00","id":69,"github_login":null}},{"bidder_id":30,"auction_id":18,"amount":3199,"created_at":"2016-03-14T17:59:39+00:00","updated_at":"2016-03-14T17:59:39+00:00","id":230,"bidder":{"github_id":"387035","duns_number":"080033077","name":"Christian G. Warden","sam_account":true,"created_at":"2015-12-29T16:14:47+00:00","updated_at":"2016-01-11T03:15:25+00:00","id":30,"github_login":null}},{"bidder_id":69,"auction_id":18,"amount":3200,"created_at":"2016-03-14T17:59:21+00:00","updated_at":"2016-03-14T17:59:21+00:00","id":223,"bidder":{"github_id":"15251877","duns_number":"079859219","name":"Daniel Connery","sam_account":true,"created_at":"2016-01-05T18:43:53+00:00","updated_at":"2016-01-11T03:15:51+00:00","id":69,"github_login":null}},{"bidder_id":90,"auction_id":18,"amount":3299,"created_at":"2016-03-14T17:58:52+00:00","updated_at":"2016-03-14T17:58:52+00:00","id":217,"bidder":{"github_id":"684965","duns_number":"080126095","name":"Joe Hand","sam_account":true,"created_at":"2016-01-11T18:33:42+00:00","updated_at":"2016-02-24T18:04:37+00:00","id":90,"github_login":null}},{"bidder_id":49,"auction_id":18,"amount":3300,"created_at":"2016-03-14T17:58:42+00:00","updated_at":"2016-03-14T17:58:42+00:00","id":213,"bidder":{"github_id":"688980","duns_number":"313210696","name":"Mila Frerichs","sam_account":true,"created_at":"2015-12-30T06:05:37+00:00","updated_at":"2016-01-11T03:15:33+00:00","id":49,"github_login":null}},{"bidder_id":69,"auction_id":18,"amount":3396,"created_at":"2016-03-14T17:58:23+00:00","updated_at":"2016-03-14T17:58:23+00:00","id":211,"bidder":{"github_id":"15251877","duns_number":"079859219","name":"Daniel Connery","sam_account":true,"created_at":"2016-01-05T18:43:53+00:00","updated_at":"2016-01-11T03:15:51+00:00","id":69,"github_login":null}},{"bidder_id":90,"auction_id":18,"amount":3397,"created_at":"2016-03-14T17:58:05+00:00","updated_at":"2016-03-14T17:58:05+00:00","id":210,"bidder":{"github_id":"684965","duns_number":"080126095","name":"Joe Hand","sam_account":true,"created_at":"2016-01-11T18:33:42+00:00","updated_at":"2016-02-24T18:04:37+00:00","id":90,"github_login":null}},{"bidder_id":69,"auction_id":18,"amount":3398,"created_at":"2016-03-14T17:57:21+00:00","updated_at":"2016-03-14T17:57:21+00:00","id":207,"bidder":{"github_id":"15251877","duns_number":"079859219","name":"Daniel Connery","sam_account":true,"created_at":"2016-01-05T18:43:53+00:00","updated_at":"2016-01-11T03:15:51+00:00","id":69,"github_login":null}},{"bidder_id":90,"auction_id":18,"amount":3399,"created_at":"2016-03-14T17:56:56+00:00","updated_at":"2016-03-14T17:56:56+00:00","id":205,"bidder":{"github_id":"684965","duns_number":"080126095","name":"Joe Hand","sam_account":true,"created_at":"2016-01-11T18:33:42+00:00","updated_at":"2016-02-24T18:04:37+00:00","id":90,"github_login":null}},{"bidder_id":20,"auction_id":18,"amount":3400,"created_at":"2016-03-14T15:55:27+00:00","updated_at":"2016-03-14T15:55:27+00:00","id":199,"bidder":{"github_id":"2989753","duns_number":"07-865-0836","name":"Jorge Tierno","sam_account":true,"created_at":"2015-12-29T13:33:34+00:00","updated_at":"2016-01-11T03:15:10+00:00","id":20,"github_login":null}},{"bidder_id":30,"auction_id":18,"amount":3499,"created_at":"2016-03-10T18:33:25+00:00","updated_at":"2016-03-10T18:33:25+00:00","id":179,"bidder":{"github_id":"387035","duns_number":"080033077","name":"Christian G. Warden","sam_account":true,"created_at":"2015-12-29T16:14:47+00:00","updated_at":"2016-01-11T03:15:25+00:00","id":30,"github_login":null}}],"created_at":"2016-03-07T22:22:58+00:00","updated_at":"2016-03-07T22:22:58+00:00","summary":"Open Opportunities uses the open source [sails.js](http://sailsjs.org/) MVC framework (Node.js / Express) and the [Mocha](https://mochajs.org/) and [Chai](http://chaijs.com/) test frameworks.  Currently, a task creator should receive the following notification if a task they created receives a comment. This issue sees the creation of a failing test that will only pass when the notification functionality is restored."},{"issue_url":"https://github.com/18F/openopps-platform/pull/1267","github_repo":"https://github.com/18F/openopps-platform/","start_price":3500,"start_datetime":"2016-03-10T18:00:00+00:00","end_datetime":"2016-03-14T18:00:00+00:00","title":"Open Opportunities: Task Creation Helper-Text","description":"# Description\r\n\r\nOpen Opportunities uses the open source [sails.js](http://sailsjs.org/) MVC framework (Node.js / Express). The platform helps government workers foster collaboration on their projects. This issue seeks to add sample description text to the Task Creation Form, when the \"Full Time Detail\" Option is selected as well as modify a few other parts of the form behavior.\r\n\r\nFor the full description, please see the [GitHub Issue](https://github.com/18F/openopps-platform/issues/1230)\r\n\r\n## Auction rules\r\n\r\nRegistered users on micropurchase.18f.gov may bid to deliver the requirements in this auction. The lowest bidder at the time the auction closes shall receive the award. The awarded bidder shall have five business days to deliver the requirements. Upon successful completion of the requirements, 18F shall pay the winning bidder.\r\n\r\nAlso see our [policies and guidelines page](https://micropurchase.18f.gov/faq).\r\n\r\n## Acceptance Criteria\r\n\r\n### 1.) Move the “What Type of Effort is Needed to Step 1”\r\n\r\nGiven that the user is an authenticated agency user,\r\n\r\nWhen the user creates or edits a task, (using the `TaskFromCreationView` and the `TaskFormEditView`),\r\n\r\nThen they should see that the \"What Type of Effort is Needed\" as Step 1. (Moved from step 3).\r\n\r\n\u003chr /\u003e\r\n\r\n\r\n\r\n### 2.) Given that the user is an authenticated agency user and is creating or editing a task,\r\n\r\nWhen the user selects \"Full Time Detail\" in Step 1 (What type of effort is needed?),\r\n\r\nThen agency specific sample text should be added to the \"description\" field, if there was no previous description text.\r\n\r\n\u003chr /\u003e\r\n\r\n### 3.) Add a button to reveal the sample text if the user has updated the description field\r\n\r\nGiven that the user is authenticated and has full-time detail agency and is creating or editing a task,\r\n\r\nThen a button stating \"Show Default Description\" will appear, and when clicked that button will reveal the default description for a full-time detail.\r\n\r\n\u003chr /\u003e\r\n\r\n### 4.) Make the sample text configurable in `assets/js/backbone/config/ui.json`  and update CONFIG.md. \r\n\r\nIf configuration is not present, the  [Show Default Description] button should not appear.\r\n\r\nThe configuration must support markdown with links and formatting that can be entered in the description area of this page. Newlines should be allowed, and if any special escaping is required, it needs to be documented.\r\n\r\nFor example:\r\n\r\n```\r\n{\r\n  \"full-time-detail\": {\r\n    \"description\": \"this is some text\"\r\n  }\r\n}\r\n```\r\n\r\n## General acceptance criteria\r\n\r\nB or better code climate grade and 90% or higher test coverage for all modifications.\r\nTests adequately cover any new functionality.\r\nTests run on Travis-CI and do not break the build.\r\nNew features do not degrade accessibility (use pa11y/HTML Code Sniffer).\r\n\r\n## Resources\r\n\r\n- https://github.com/18F/openopps-platform/issues/1230\r\n- http://sailsjs.org/\r\n\r\n## Deliverables\r\n\r\nA single pull request submitted to https://github.com/18F/openopps-platform with clear, descriptive commits that satisfy all of the above acceptance criteria.\r\n","id":19,"bids":[{"bidder_id":137,"auction_id":19,"amount":1875,"created_at":"2016-03-14T17:59:54+00:00","updated_at":"2016-03-14T17:59:54+00:00","id":236,"bidder":{"github_id":"244419","duns_number":"403283463","name":"orangewise","sam_account":true,"created_at":"2016-01-31T08:52:30+00:00","updated_at":"2016-02-03T16:48:05+00:00","id":137,"github_login":null}},{"bidder_id":173,"auction_id":19,"amount":1900,"created_at":"2016-03-14T17:59:47+00:00","updated_at":"2016-03-14T17:59:47+00:00","id":234,"bidder":{"github_id":"17800224","duns_number":"144182268","name":"Scott Construction, Inc.","sam_account":true,"created_at":"2016-03-12T15:46:37+00:00","updated_at":"2016-03-12T22:50:02+00:00","id":173,"github_login":null}},{"bidder_id":44,"auction_id":19,"amount":1999,"created_at":"2016-03-14T17:59:28+00:00","updated_at":"2016-03-14T17:59:28+00:00","id":225,"bidder":{"github_id":"1451399","duns_number":"080014807","name":"Dan Siddoway","sam_account":true,"created_at":"2015-12-29T23:22:12+00:00","updated_at":"2016-01-29T18:07:33+00:00","id":44,"github_login":null}},{"bidder_id":173,"auction_id":19,"amount":2400,"created_at":"2016-03-14T17:59:13+00:00","updated_at":"2016-03-14T17:59:13+00:00","id":220,"bidder":{"github_id":"17800224","duns_number":"144182268","name":"Scott Construction, Inc.","sam_account":true,"created_at":"2016-03-12T15:46:37+00:00","updated_at":"2016-03-12T22:50:02+00:00","id":173,"github_login":null}},{"bidder_id":44,"auction_id":19,"amount":2499,"created_at":"2016-03-14T17:58:49+00:00","updated_at":"2016-03-14T17:58:49+00:00","id":216,"bidder":{"github_id":"1451399","duns_number":"080014807","name":"Dan Siddoway","sam_account":true,"created_at":"2015-12-29T23:22:12+00:00","updated_at":"2016-01-29T18:07:33+00:00","id":44,"github_login":null}},{"bidder_id":173,"auction_id":19,"amount":2900,"created_at":"2016-03-14T17:58:42+00:00","updated_at":"2016-03-14T17:58:42+00:00","id":214,"bidder":{"github_id":"17800224","duns_number":"144182268","name":"Scott Construction, Inc.","sam_account":true,"created_at":"2016-03-12T15:46:37+00:00","updated_at":"2016-03-12T22:50:02+00:00","id":173,"github_login":null}},{"bidder_id":90,"auction_id":19,"amount":2999,"created_at":"2016-03-14T17:58:26+00:00","updated_at":"2016-03-14T17:58:26+00:00","id":212,"bidder":{"github_id":"684965","duns_number":"080126095","name":"Joe Hand","sam_account":true,"created_at":"2016-01-11T18:33:42+00:00","updated_at":"2016-02-24T18:04:37+00:00","id":90,"github_login":null}},{"bidder_id":173,"auction_id":19,"amount":3000,"created_at":"2016-03-14T16:23:47+00:00","updated_at":"2016-03-14T16:23:47+00:00","id":202,"bidder":{"github_id":"17800224","duns_number":"144182268","name":"Scott Construction, Inc.","sam_account":true,"created_at":"2016-03-12T15:46:37+00:00","updated_at":"2016-03-12T22:50:02+00:00","id":173,"github_login":null}},{"bidder_id":90,"auction_id":19,"amount":3149,"created_at":"2016-03-14T15:36:22+00:00","updated_at":"2016-03-14T15:36:22+00:00","id":197,"bidder":{"github_id":"684965","duns_number":"080126095","name":"Joe Hand","sam_account":true,"created_at":"2016-01-11T18:33:42+00:00","updated_at":"2016-02-24T18:04:37+00:00","id":90,"github_login":null}},{"bidder_id":173,"auction_id":19,"amount":3399,"created_at":"2016-03-12T23:55:22+00:00","updated_at":"2016-03-12T23:55:22+00:00","id":190,"bidder":{"github_id":"17800224","duns_number":"144182268","name":"Scott Construction, Inc.","sam_account":true,"created_at":"2016-03-12T15:46:37+00:00","updated_at":"2016-03-12T22:50:02+00:00","id":173,"github_login":null}},{"bidder_id":137,"auction_id":19,"amount":3400,"created_at":"2016-03-11T13:31:02+00:00","updated_at":"2016-03-11T13:31:02+00:00","id":186,"bidder":{"github_id":"244419","duns_number":"403283463","name":"orangewise","sam_account":true,"created_at":"2016-01-31T08:52:30+00:00","updated_at":"2016-02-03T16:48:05+00:00","id":137,"github_login":null}},{"bidder_id":30,"auction_id":19,"amount":3498,"created_at":"2016-03-10T21:23:11+00:00","updated_at":"2016-03-10T21:23:11+00:00","id":182,"bidder":{"github_id":"387035","duns_number":"080033077","name":"Christian G. Warden","sam_account":true,"created_at":"2015-12-29T16:14:47+00:00","updated_at":"2016-01-11T03:15:25+00:00","id":30,"github_login":null}},{"bidder_id":49,"auction_id":19,"amount":3499,"created_at":"2016-03-10T18:05:02+00:00","updated_at":"2016-03-10T18:05:02+00:00","id":177,"bidder":{"github_id":"688980","duns_number":"313210696","name":"Mila Frerichs","sam_account":true,"created_at":"2015-12-30T06:05:37+00:00","updated_at":"2016-01-11T03:15:33+00:00","id":49,"github_login":null}}],"created_at":"2016-03-08T16:11:17+00:00","updated_at":"2016-03-08T16:11:17+00:00","summary":"Open Opportunities uses the open source [sails.js](http://sailsjs.org/) MVC framework (Node.js / Express). The platform helps government workers foster collaboration on their projects. This issue seeks to add sample description text to the Task Creation Form, when the \"Full Time Detail\" Option is selected."},{"issue_url":"https://github.com/18F/openopps-platform/issues/1248","github_repo":"https://github.com/18F/openopps-platform","start_price":3500,"start_datetime":"2016-03-10T18:00:00+00:00","end_datetime":"2016-03-14T18:00:00+00:00","title":"Open Opportunities: Add Sails-DB-Migrations","description":"## Description\r\n\r\nOpen Opportunities uses the open source [sails.js](http://sailsjs.org/) MVC framework (Node.js / Express). We want to use the [sails-db-migrate](https://github.com/building5/sails-db-migrate) package so deployments can be executed in Javascript, and developers can easily manage migrations.\r\n\r\nWe need to support new developers starting with no prior database, as well as future migrations for people at the current version. (It's ok for people who have code from several versions ago to need to run the current scripts with `psql`).\r\n\r\n## Auction rules\r\n\r\nRegistered users on micropurchase.18f.gov may bid to deliver the requirements in this auction. The lowest bidder at the time the auction closes shall receive the award. The awarded bidder shall have five business days to deliver the requirements. Upon successful completion of the requirements, 18F shall pay the winning bidder.\r\n\r\nAlso see our [policies and guidelines page](https://micropurchase.18f.gov/faq).\r\n\r\n## Acceptance Criteria\r\n\r\n### Ensuring the migrations run\r\n\r\nWhen a developer runs either `npm run init`, `npm run install`, or `npm run demo` from the command-line,\r\n\r\nThen all the database migrations should be run before the app loads.\r\n\r\n\u003chr /\u003e\r\n\r\n### Warning about pending migrations\r\n\r\nWhen a developer runs `npm run start` or `npm run watch` from the command-line,\r\n\r\nThen they should receive a warning if there are pending migrations. The warning should that state which migrations are pending.\r\n\r\n\u003chr /\u003e\r\n\r\n### Documentation\r\n\r\nThe pull request must include new documentation that describes how to create a migration in the following files:\r\n\r\n- INSTALL.md\r\n- CONTRIBUTING.md\r\n\r\n- When the instructions in the documentation are followed for writing a new migration, the database should be modified as described, and the app should run and be able to access the new model or attribute.\r\n\r\n## General acceptance criteria\r\n\r\n- All new functionality does not degrade code climate rating\r\n- Tests run on Travis-CI and do not break the build.\r\n- New features do not degrade accessibility (use pa11y/HTML Code Sniffer).\r\n\r\n## Resources\r\n\r\n- https://github.com/18F/openopps-platform/issues/1248\r\n- https://pages.18f.gov/openopps-platform/\r\n- https://github.com/building5/sails-db-migrate\r\n- http://sailsjs.org/\r\n\r\n## Deliverables\r\n\r\nA single pull request submitted to https://github.com/18F/openopps-platform with clear, descriptive commits that satisfy all of the above acceptance criteria.\r\n","id":17,"bids":[{"bidder_id":30,"auction_id":17,"amount":2198,"created_at":"2016-03-14T17:59:48+00:00","updated_at":"2016-03-14T17:59:48+00:00","id":235,"bidder":{"github_id":"387035","duns_number":"080033077","name":"Christian G. Warden","sam_account":true,"created_at":"2015-12-29T16:14:47+00:00","updated_at":"2016-01-11T03:15:25+00:00","id":30,"github_login":null}},{"bidder_id":44,"auction_id":17,"amount":2199,"created_at":"2016-03-14T17:59:46+00:00","updated_at":"2016-03-14T17:59:46+00:00","id":232,"bidder":{"github_id":"1451399","duns_number":"080014807","name":"Dan Siddoway","sam_account":true,"created_at":"2015-12-29T23:22:12+00:00","updated_at":"2016-01-29T18:07:33+00:00","id":44,"github_login":null}},{"bidder_id":30,"auction_id":17,"amount":2299,"created_at":"2016-03-14T17:59:38+00:00","updated_at":"2016-03-14T17:59:38+00:00","id":229,"bidder":{"github_id":"387035","duns_number":"080033077","name":"Christian G. Warden","sam_account":true,"created_at":"2015-12-29T16:14:47+00:00","updated_at":"2016-01-11T03:15:25+00:00","id":30,"github_login":null}},{"bidder_id":173,"auction_id":17,"amount":2300,"created_at":"2016-03-14T17:59:34+00:00","updated_at":"2016-03-14T17:59:34+00:00","id":226,"bidder":{"github_id":"17800224","duns_number":"144182268","name":"Scott Construction, Inc.","sam_account":true,"created_at":"2016-03-12T15:46:37+00:00","updated_at":"2016-03-12T22:50:02+00:00","id":173,"github_login":null}},{"bidder_id":44,"auction_id":17,"amount":2499,"created_at":"2016-03-14T17:59:18+00:00","updated_at":"2016-03-14T17:59:18+00:00","id":222,"bidder":{"github_id":"1451399","duns_number":"080014807","name":"Dan Siddoway","sam_account":true,"created_at":"2015-12-29T23:22:12+00:00","updated_at":"2016-01-29T18:07:33+00:00","id":44,"github_login":null}},{"bidder_id":173,"auction_id":17,"amount":2900,"created_at":"2016-03-14T17:58:58+00:00","updated_at":"2016-03-14T17:58:58+00:00","id":219,"bidder":{"github_id":"17800224","duns_number":"144182268","name":"Scott Construction, Inc.","sam_account":true,"created_at":"2016-03-12T15:46:37+00:00","updated_at":"2016-03-12T22:50:02+00:00","id":173,"github_login":null}},{"bidder_id":44,"auction_id":17,"amount":2999,"created_at":"2016-03-14T17:58:46+00:00","updated_at":"2016-03-14T17:58:46+00:00","id":215,"bidder":{"github_id":"1451399","duns_number":"080014807","name":"Dan Siddoway","sam_account":true,"created_at":"2015-12-29T23:22:12+00:00","updated_at":"2016-01-29T18:07:33+00:00","id":44,"github_login":null}},{"bidder_id":173,"auction_id":17,"amount":3400,"created_at":"2016-03-14T16:24:13+00:00","updated_at":"2016-03-14T16:24:13+00:00","id":204,"bidder":{"github_id":"17800224","duns_number":"144182268","name":"Scott Construction, Inc.","sam_account":true,"created_at":"2016-03-12T15:46:37+00:00","updated_at":"2016-03-12T22:50:02+00:00","id":173,"github_login":null}},{"bidder_id":30,"auction_id":17,"amount":3497,"created_at":"2016-03-14T15:44:58+00:00","updated_at":"2016-03-14T15:44:58+00:00","id":198,"bidder":{"github_id":"387035","duns_number":"080033077","name":"Christian G. Warden","sam_account":true,"created_at":"2015-12-29T16:14:47+00:00","updated_at":"2016-01-11T03:15:25+00:00","id":30,"github_login":null}},{"bidder_id":173,"auction_id":17,"amount":3498,"created_at":"2016-03-13T00:04:07+00:00","updated_at":"2016-03-13T00:04:07+00:00","id":192,"bidder":{"github_id":"17800224","duns_number":"144182268","name":"Scott Construction, Inc.","sam_account":true,"created_at":"2016-03-12T15:46:37+00:00","updated_at":"2016-03-12T22:50:02+00:00","id":173,"github_login":null}},{"bidder_id":30,"auction_id":17,"amount":3499,"created_at":"2016-03-12T00:32:29+00:00","updated_at":"2016-03-12T00:32:29+00:00","id":188,"bidder":{"github_id":"387035","duns_number":"080033077","name":"Christian G. Warden","sam_account":true,"created_at":"2015-12-29T16:14:47+00:00","updated_at":"2016-01-11T03:15:25+00:00","id":30,"github_login":null}}],"created_at":"2016-03-07T20:55:34+00:00","updated_at":"2016-03-07T20:55:34+00:00","summary":"Open Opportunities uses the open source [sails.js](http://sailsjs.org/) MVC framework (Node.js / Express). We want to use the [sails-db-migrate](https://github.com/building5/sails-db-migrate) package so deployments can be executed in Javascript, and developers can easily manage migrations."},{"issue_url":"https://github.com/18F/openopps-platform/issues/1229","github_repo":"https://github.com/18F/openopps-platform","start_price":3500,"start_datetime":"2016-03-10T18:00:00+00:00","end_datetime":"2016-03-14T18:00:00+00:00","title":"Open Opportunities: Create Agency Admin User Role","description":"# Description\r\nOpen Opportunities uses the open source [sails.js](http://sailsjs.org/) MVC framework (Node.js / Express). This issue seeks to create a user role of \"Agency Admin\" that gives the user access to all of the admin pages in that agency. For this micro-purchase to be complete, the vendor will create an `isAgencyAdmin` property on the user, create a policy to regulate agency admin access, and create the ability for admins to promote users to an agency admin.\r\n\r\nThis will be used for future functionality on the agency data tag.\r\n\r\nFor more information please see the [Github Issue](https://github.com/18F/openopps-platform/issues/1229)\r\n\r\n## Auction rules\r\n\r\nRegistered users on micropurchase.18f.gov may bid to deliver the requirements in this auction. The lowest bidder at the time the auction closes shall receive the award. The awarded bidder shall have five business days to deliver the requirements. Upon successful completion of the requirements, 18F shall pay the winning bidder.\r\n\r\nAlso see our [policies and guidelines page](https://micropurchase.18f.gov/faq).\r\n\r\n## Acceptance Criteria\r\n\r\n### 1.) Add “agency admin” property to user\r\n\r\nA migration script to add `isAgencyAdmin` to the midas_user table\r\n\r\n\r\n\r\n### 2.) Develop an “agency admin” policy\r\n\r\nGiven a user is an `agency admin`,\r\n\r\nWhen they try to access admin pages,\r\n\r\nThen they would only be able to access admin pages within their own agency.  When an `admin user` visits the `/adminadmin user management page`, then browser should redirect to their agency admin page at `admin/agencies/:agencyid` with a placeholder page\r\n\r\n\r\n(Looking at the isAdmin policy would provide an example of the updated policy)\r\n\r\n\u003chr /\u003e\r\n\r\n### 3.) Enable an admin to create an “agency admin”\r\n\r\nWhen an `admin user` visits the `admin user management page`,\r\n\r\nThen they should be able to at any user to be  an agency admin via a UI control\r\n\r\n## General acceptance criteria\r\n\r\nB or better Code Climate grade and 90% or higher test coverage for all modifications.\r\nTests adequately cover any new functionality.\r\nTests run on Travis-CI and do not break the build.\r\nNew features do not degrade accessibility (use pa11y/HTML Code Sniffer).\r\n\r\n## Resources\r\n\r\n- https://github.com/18F/openopps-platform/issues/1229\r\n- [Use of the isAdmin policy](https://github.com/18F/openopps-platform/blob/14283ade4c5725e2e28403b5e367bddde8139c7f/api/policies/user.js)\r\n- http://sailsjs.org/\r\n\r\n## Deliverables\r\n\r\nA single pull request submitted to https://github.com/18F/openopps-platform with clear, descriptive commits that satisfy all of the above acceptance criteria.","id":20,"bids":[{"bidder_id":30,"auction_id":20,"amount":2399,"created_at":"2016-03-14T17:59:58+00:00","updated_at":"2016-03-14T17:59:58+00:00","id":239,"bidder":{"github_id":"387035","duns_number":"080033077","name":"Christian G. Warden","sam_account":true,"created_at":"2015-12-29T16:14:47+00:00","updated_at":"2016-01-11T03:15:25+00:00","id":30,"github_login":null}},{"bidder_id":173,"auction_id":20,"amount":2400,"created_at":"2016-03-14T17:59:56+00:00","updated_at":"2016-03-14T17:59:56+00:00","id":237,"bidder":{"github_id":"17800224","duns_number":"144182268","name":"Scott Construction, Inc.","sam_account":true,"created_at":"2016-03-12T15:46:37+00:00","updated_at":"2016-03-12T22:50:02+00:00","id":173,"github_login":null}},{"bidder_id":30,"auction_id":20,"amount":2499,"created_at":"2016-03-14T17:59:47+00:00","updated_at":"2016-03-14T17:59:47+00:00","id":233,"bidder":{"github_id":"387035","duns_number":"080033077","name":"Christian G. Warden","sam_account":true,"created_at":"2015-12-29T16:14:47+00:00","updated_at":"2016-01-11T03:15:25+00:00","id":30,"github_login":null}},{"bidder_id":90,"auction_id":20,"amount":2500,"created_at":"2016-03-14T17:59:45+00:00","updated_at":"2016-03-14T17:59:45+00:00","id":231,"bidder":{"github_id":"684965","duns_number":"080126095","name":"Joe Hand","sam_account":true,"created_at":"2016-01-11T18:33:42+00:00","updated_at":"2016-02-24T18:04:37+00:00","id":90,"github_login":null}},{"bidder_id":30,"auction_id":20,"amount":2699,"created_at":"2016-03-14T17:59:38+00:00","updated_at":"2016-03-14T17:59:38+00:00","id":228,"bidder":{"github_id":"387035","duns_number":"080033077","name":"Christian G. Warden","sam_account":true,"created_at":"2015-12-29T16:14:47+00:00","updated_at":"2016-01-11T03:15:25+00:00","id":30,"github_login":null}},{"bidder_id":173,"auction_id":20,"amount":2700,"created_at":"2016-03-14T17:59:26+00:00","updated_at":"2016-03-14T17:59:26+00:00","id":224,"bidder":{"github_id":"17800224","duns_number":"144182268","name":"Scott Construction, Inc.","sam_account":true,"created_at":"2016-03-12T15:46:37+00:00","updated_at":"2016-03-12T22:50:02+00:00","id":173,"github_login":null}},{"bidder_id":90,"auction_id":20,"amount":2777,"created_at":"2016-03-14T17:59:14+00:00","updated_at":"2016-03-14T17:59:14+00:00","id":221,"bidder":{"github_id":"684965","duns_number":"080126095","name":"Joe Hand","sam_account":true,"created_at":"2016-01-11T18:33:42+00:00","updated_at":"2016-02-24T18:04:37+00:00","id":90,"github_login":null}},{"bidder_id":173,"auction_id":20,"amount":2800,"created_at":"2016-03-14T17:58:02+00:00","updated_at":"2016-03-14T17:58:02+00:00","id":209,"bidder":{"github_id":"17800224","duns_number":"144182268","name":"Scott Construction, Inc.","sam_account":true,"created_at":"2016-03-12T15:46:37+00:00","updated_at":"2016-03-12T22:50:02+00:00","id":173,"github_login":null}},{"bidder_id":90,"auction_id":20,"amount":2891,"created_at":"2016-03-14T17:57:51+00:00","updated_at":"2016-03-14T17:57:51+00:00","id":208,"bidder":{"github_id":"684965","duns_number":"080126095","name":"Joe Hand","sam_account":true,"created_at":"2016-01-11T18:33:42+00:00","updated_at":"2016-02-24T18:04:37+00:00","id":90,"github_login":null}},{"bidder_id":30,"auction_id":20,"amount":2899,"created_at":"2016-03-14T17:57:21+00:00","updated_at":"2016-03-14T17:57:21+00:00","id":206,"bidder":{"github_id":"387035","duns_number":"080033077","name":"Christian G. Warden","sam_account":true,"created_at":"2015-12-29T16:14:47+00:00","updated_at":"2016-01-11T03:15:25+00:00","id":30,"github_login":null}},{"bidder_id":173,"auction_id":20,"amount":2900,"created_at":"2016-03-14T16:23:59+00:00","updated_at":"2016-03-14T16:23:59+00:00","id":203,"bidder":{"github_id":"17800224","duns_number":"144182268","name":"Scott Construction, Inc.","sam_account":true,"created_at":"2016-03-12T15:46:37+00:00","updated_at":"2016-03-12T22:50:02+00:00","id":173,"github_login":null}},{"bidder_id":90,"auction_id":20,"amount":3000,"created_at":"2016-03-14T15:35:09+00:00","updated_at":"2016-03-14T15:35:09+00:00","id":196,"bidder":{"github_id":"684965","duns_number":"080126095","name":"Joe Hand","sam_account":true,"created_at":"2016-01-11T18:33:42+00:00","updated_at":"2016-02-24T18:04:37+00:00","id":90,"github_login":null}},{"bidder_id":173,"auction_id":20,"amount":3499,"created_at":"2016-03-13T00:00:44+00:00","updated_at":"2016-03-13T00:00:44+00:00","id":191,"bidder":{"github_id":"17800224","duns_number":"144182268","name":"Scott Construction, Inc.","sam_account":true,"created_at":"2016-03-12T15:46:37+00:00","updated_at":"2016-03-12T22:50:02+00:00","id":173,"github_login":null}}],"created_at":"2016-03-08T16:52:38+00:00","updated_at":"2016-03-08T16:52:38+00:00","summary":"The Open Opportunities is a node.js-based platform to foster collaboration on government projects. This issue seeks to create a new user role for \"Agency Admins\" that will (in the future) give those users admin privileges to see data for users from their agency."},{"issue_url":"https://github.com/18F/tock/issues/308","github_repo":"https://github.com/18F/tock","start_price":3500,"start_datetime":"2016-02-24T18:00:00+00:00","end_datetime":"2016-02-26T18:00:00+00:00","title":"Reload Tock Projects in new reporting period","description":"## Description\r\nIn our project tracking software Tock, from week to week, chances are the projects a user is logging to changes very little. However, currently when a new timesheet is opened, it starts out blank. To save time, this issue seeks to auto-populate the project rows for a new reporting period with project rows that were logged from the previous week.\r\n\r\n## Auction rules \r\n\r\nRegistered users on micropurchase.18f.gov may bid to deliver the requirements in this auction. The lowest bidder at the time the auction closes shall receive the award. The awarded bidder shall have five business days after the conclusion of the auction period to deliver the requirements. Upon successful completion of the requirements, 18F shall pay the winning bidder.\r\n\r\nAlso see our [policies and guidelines page](https://micropurchase.18f.gov/faq) for more information. \r\n\r\n## Acceptance Criteria\r\n\r\n- When the user opens a **new** reporting period timesheet is pre-populated with the users’ previous week's projects.\r\n- Only the projects are carried over, the hours are blank.\r\n- When the user opens a **saved** reporting period timesheet, the timesheet does not pre-populate with the previous week's projects (i.e. the saved timesheet is not overwritten with last week's projects when re-opened)\r\n-  A user can remove line items from an **unsubmitted** (i.e a new or saved) timesheet.\r\n-  Once the old lines have been added, a user should still be able to add additional line items to an **unsubmitted** timesheet.\r\n\r\n## General acceptance criteria \r\n\r\n- B or better Code Climate grade and 90% or higher test coverage for all modifications.\r\n- Tests adequately cover any new functionality.\r\n- Tests run on Travis-CI and do not break the build.\r\n\r\n## Resources\r\n\r\n- https://github.com/18F/tock/issues/308\r\n\r\n## Deliverables\r\n\r\nA single pull request submitted to https://github.com/18F/tock with clear, descriptive commits that satisfy all of the above acceptance criteria.\r\n","id":15,"bids":[{"bidder_id":36,"auction_id":15,"amount":1543,"created_at":"2016-02-26T17:59:56+00:00","updated_at":"2016-02-26T17:59:56+00:00","id":176,"bidder":{"github_id":"1060893","duns_number":"080037478","name":"brendan sudol","sam_account":true,"created_at":"2015-12-29T17:39:36+00:00","updated_at":"2016-01-11T00:44:39+00:00","id":36,"github_login":null}},{"bidder_id":44,"auction_id":15,"amount":1600,"created_at":"2016-02-26T17:59:55+00:00","updated_at":"2016-02-26T17:59:55+00:00","id":175,"bidder":{"github_id":"1451399","duns_number":"080014807","name":"Dan Siddoway","sam_account":true,"created_at":"2015-12-29T23:22:12+00:00","updated_at":"2016-01-29T18:07:33+00:00","id":44,"github_login":null}},{"bidder_id":161,"auction_id":15,"amount":1700,"created_at":"2016-02-26T17:59:47+00:00","updated_at":"2016-02-26T17:59:47+00:00","id":174,"bidder":{"github_id":"833570","duns_number":"07-944-1444","name":"Evan Rose","sam_account":true,"created_at":"2016-02-25T01:14:16+00:00","updated_at":"2016-02-25T15:09:02+00:00","id":161,"github_login":null}},{"bidder_id":69,"auction_id":15,"amount":1825,"created_at":"2016-02-26T17:59:41+00:00","updated_at":"2016-02-26T17:59:41+00:00","id":171,"bidder":{"github_id":"15251877","duns_number":"079859219","name":"Daniel Connery","sam_account":true,"created_at":"2016-01-05T18:43:53+00:00","updated_at":"2016-01-11T03:15:51+00:00","id":69,"github_login":null}},{"bidder_id":37,"auction_id":15,"amount":1850,"created_at":"2016-02-26T17:59:25+00:00","updated_at":"2016-02-26T17:59:25+00:00","id":169,"bidder":{"github_id":"461046","duns_number":"080039148","name":"Justin Duke","sam_account":true,"created_at":"2015-12-29T18:02:46+00:00","updated_at":"2016-01-19T14:02:38+00:00","id":37,"github_login":null}},{"bidder_id":44,"auction_id":15,"amount":1900,"created_at":"2016-02-26T17:59:10+00:00","updated_at":"2016-02-26T17:59:10+00:00","id":167,"bidder":{"github_id":"1451399","duns_number":"080014807","name":"Dan Siddoway","sam_account":true,"created_at":"2015-12-29T23:22:12+00:00","updated_at":"2016-01-29T18:07:33+00:00","id":44,"github_login":null}},{"bidder_id":69,"auction_id":15,"amount":1950,"created_at":"2016-02-26T17:59:04+00:00","updated_at":"2016-02-26T17:59:04+00:00","id":164,"bidder":{"github_id":"15251877","duns_number":"079859219","name":"Daniel Connery","sam_account":true,"created_at":"2016-01-05T18:43:53+00:00","updated_at":"2016-01-11T03:15:51+00:00","id":69,"github_login":null}},{"bidder_id":161,"auction_id":15,"amount":1997,"created_at":"2016-02-26T17:58:38+00:00","updated_at":"2016-02-26T17:58:38+00:00","id":163,"bidder":{"github_id":"833570","duns_number":"07-944-1444","name":"Evan Rose","sam_account":true,"created_at":"2016-02-25T01:14:16+00:00","updated_at":"2016-02-25T15:09:02+00:00","id":161,"github_login":null}},{"bidder_id":161,"auction_id":15,"amount":1998,"created_at":"2016-02-26T17:58:25+00:00","updated_at":"2016-02-26T17:58:25+00:00","id":162,"bidder":{"github_id":"833570","duns_number":"07-944-1444","name":"Evan Rose","sam_account":true,"created_at":"2016-02-25T01:14:16+00:00","updated_at":"2016-02-25T15:09:02+00:00","id":161,"github_login":null}},{"bidder_id":69,"auction_id":15,"amount":1999,"created_at":"2016-02-26T17:57:23+00:00","updated_at":"2016-02-26T17:57:23+00:00","id":159,"bidder":{"github_id":"15251877","duns_number":"079859219","name":"Daniel Connery","sam_account":true,"created_at":"2016-01-05T18:43:53+00:00","updated_at":"2016-01-11T03:15:51+00:00","id":69,"github_login":null}},{"bidder_id":37,"auction_id":15,"amount":2100,"created_at":"2016-02-26T17:56:47+00:00","updated_at":"2016-02-26T17:56:47+00:00","id":156,"bidder":{"github_id":"461046","duns_number":"080039148","name":"Justin Duke","sam_account":true,"created_at":"2015-12-29T18:02:46+00:00","updated_at":"2016-01-19T14:02:38+00:00","id":37,"github_login":null}},{"bidder_id":34,"auction_id":15,"amount":2200,"created_at":"2016-02-26T17:23:01+00:00","updated_at":"2016-02-26T17:23:01+00:00","id":150,"bidder":{"github_id":"6887045","duns_number":"078327018","name":null,"sam_account":true,"created_at":"2015-12-29T17:29:09+00:00","updated_at":"2016-01-11T00:44:39+00:00","id":34,"github_login":null}},{"bidder_id":37,"auction_id":15,"amount":2475,"created_at":"2016-02-26T17:14:20+00:00","updated_at":"2016-02-26T17:14:20+00:00","id":149,"bidder":{"github_id":"461046","duns_number":"080039148","name":"Justin Duke","sam_account":true,"created_at":"2015-12-29T18:02:46+00:00","updated_at":"2016-01-19T14:02:38+00:00","id":37,"github_login":null}},{"bidder_id":34,"auction_id":15,"amount":2488,"created_at":"2016-02-26T16:34:09+00:00","updated_at":"2016-02-26T16:34:09+00:00","id":145,"bidder":{"github_id":"6887045","duns_number":"078327018","name":null,"sam_account":true,"created_at":"2015-12-29T17:29:09+00:00","updated_at":"2016-01-11T00:44:39+00:00","id":34,"github_login":null}},{"bidder_id":90,"auction_id":15,"amount":2694,"created_at":"2016-02-26T15:49:51+00:00","updated_at":"2016-02-26T15:49:51+00:00","id":142,"bidder":{"github_id":"684965","duns_number":"080126095","name":"Joe Hand","sam_account":true,"created_at":"2016-01-11T18:33:42+00:00","updated_at":"2016-02-24T18:04:37+00:00","id":90,"github_login":null}},{"bidder_id":34,"auction_id":15,"amount":2695,"created_at":"2016-02-26T15:06:43+00:00","updated_at":"2016-02-26T15:06:43+00:00","id":141,"bidder":{"github_id":"6887045","duns_number":"078327018","name":null,"sam_account":true,"created_at":"2015-12-29T17:29:09+00:00","updated_at":"2016-01-11T00:44:39+00:00","id":34,"github_login":null}},{"bidder_id":37,"auction_id":15,"amount":2750,"created_at":"2016-02-26T06:20:53+00:00","updated_at":"2016-02-26T06:20:53+00:00","id":139,"bidder":{"github_id":"461046","duns_number":"080039148","name":"Justin Duke","sam_account":true,"created_at":"2015-12-29T18:02:46+00:00","updated_at":"2016-01-19T14:02:38+00:00","id":37,"github_login":null}},{"bidder_id":34,"auction_id":15,"amount":2900,"created_at":"2016-02-26T00:58:58+00:00","updated_at":"2016-02-26T00:58:58+00:00","id":137,"bidder":{"github_id":"6887045","duns_number":"078327018","name":null,"sam_account":true,"created_at":"2015-12-29T17:29:09+00:00","updated_at":"2016-01-11T00:44:39+00:00","id":34,"github_login":null}},{"bidder_id":36,"auction_id":15,"amount":3200,"created_at":"2016-02-25T19:13:25+00:00","updated_at":"2016-02-25T19:13:25+00:00","id":133,"bidder":{"github_id":"1060893","duns_number":"080037478","name":"brendan sudol","sam_account":true,"created_at":"2015-12-29T17:39:36+00:00","updated_at":"2016-01-11T00:44:39+00:00","id":36,"github_login":null}}],"created_at":"2016-02-19T21:02:37+00:00","updated_at":"2016-02-19T21:02:37+00:00","summary":"In our project tracking software Tock, from week to week, chances are the projects a user is logging to changes very little. However, currently when a new timesheet is opened, it starts out blank. To save time, this issue seeks to auto-populate the project rows for a new reporting period with project rows that were logged from the previous week."},{"issue_url":"https://github.com/18F/playbook-in-action/issues/81","github_repo":"https://github.com/18F/playbook-in-action","start_price":3500,"start_datetime":"2016-02-24T18:00:00+00:00","end_datetime":"2016-02-26T18:00:00+00:00","title":"Playbook in Action - UI Fixes to Implement US Web Design Standards","description":"## Description\r\n\r\nThe [Playbook in Action](https://playbook-in-action.apps.cloud.gov) is a Python Flask application that simplifies the process of creating agile RFQs and RFPs for digital services for government Contracting Officers and Program Managers. In the application, the user creates a new document by providing the agency, document type, etc. and answers a series of questions about their objectives for the project. The result is a word document version of the RFQ/RFP that can be downloaded onto the user’s computer. \r\n\r\nThis issue seeks to migrate the front-end design and user-interface from Bootstrap to the US Web Design Standards. The issue will also require that certain CSS classes of text will have distinct styling to distinguish text that will be in the final document and text that is asking questions and providing additional information to the user.\r\n\r\nThe current styling can be overwritten as is necessary.\r\n\r\n## Auction rules \r\n\r\nRegistered users on micropurchase.18f.gov may bid to deliver the requirements in this auction. The lowest bidder at the time the auction closes shall receive the award. The awarded bidder shall have seven business days after notice of award to deliver the requirements. Upon successful completion of the requirements, 18F shall pay the winning bidder.\r\n\r\n## Application-Specific Acceptance criteria\r\n\r\nWhen a user visits any of the pages in the Playbook in Action site,\r\n\r\nThen the user will see that the assets and elements of the the [U.S. Web Design Standards](https://playbook.cio.gov/designstandards/), have been incorporated. All of the following elements should follow the styling guidelines and use the Design \r\nStandards CSS:\r\n- Font\r\n- Color scheme\r\n- Button styling\r\n- Tables\r\n- Alerts\r\n- Side navigation\r\n- Margins\r\n\r\nAdditional CSS text formatting has been implemented for the CSS classes listed in the following github issue: https://github.com/18F/playbook-in-action/issues/81\r\n\r\n\r\n### General acceptance criteria\r\n\r\nNew features do not degrade accessibility (use pa11y/HTML Code Sniffer).\r\n\r\n### Resources\r\n\r\n- U.S. Government Web Design Standards\r\n- Github Repository\r\n- https://github.com/18F/playbook-in-action/issues/81\r\n- Live Site - https://playbook-in-action.apps.cloud.gov\r\n\r\n### Deliverables\r\n\r\nA single pull request submitted to https://github.com/18F/playbook-in-action with clear, descriptive commits that satisfy all of the above acceptance criteria.\r\n","id":13,"bids":[{"bidder_id":161,"auction_id":13,"amount":2500,"created_at":"2016-02-26T17:52:57+00:00","updated_at":"2016-02-26T17:52:57+00:00","id":154,"bidder":{"github_id":"833570","duns_number":"07-944-1444","name":"Evan Rose","sam_account":true,"created_at":"2016-02-25T01:14:16+00:00","updated_at":"2016-02-25T15:09:02+00:00","id":161,"github_login":null}},{"bidder_id":36,"auction_id":13,"amount":1538,"created_at":"2016-02-26T17:33:22+00:00","updated_at":"2016-02-26T17:33:22+00:00","id":151,"bidder":{"github_id":"1060893","duns_number":"080037478","name":"brendan sudol","sam_account":true,"created_at":"2015-12-29T17:39:36+00:00","updated_at":"2016-01-11T00:44:39+00:00","id":36,"github_login":null}},{"bidder_id":44,"auction_id":13,"amount":400,"created_at":"2016-02-26T17:07:11+00:00","updated_at":"2016-02-26T17:07:11+00:00","id":146,"bidder":{"github_id":"1451399","duns_number":"080014807","name":"Dan Siddoway","sam_account":true,"created_at":"2015-12-29T23:22:12+00:00","updated_at":"2016-01-29T18:07:33+00:00","id":44,"github_login":null}},{"bidder_id":90,"auction_id":13,"amount":550,"created_at":"2016-02-25T23:33:21+00:00","updated_at":"2016-02-25T23:33:21+00:00","id":134,"bidder":{"github_id":"684965","duns_number":"080126095","name":"Joe Hand","sam_account":true,"created_at":"2016-01-11T18:33:42+00:00","updated_at":"2016-02-24T18:04:37+00:00","id":90,"github_login":null}},{"bidder_id":69,"auction_id":13,"amount":2000,"created_at":"2016-02-25T15:52:47+00:00","updated_at":"2016-02-25T15:52:47+00:00","id":130,"bidder":{"github_id":"15251877","duns_number":"079859219","name":"Daniel Connery","sam_account":true,"created_at":"2016-01-05T18:43:53+00:00","updated_at":"2016-01-11T03:15:51+00:00","id":69,"github_login":null}},{"bidder_id":37,"auction_id":13,"amount":720,"created_at":"2016-02-24T22:28:04+00:00","updated_at":"2016-02-24T22:28:04+00:00","id":127,"bidder":{"github_id":"461046","duns_number":"080039148","name":"Justin Duke","sam_account":true,"created_at":"2015-12-29T18:02:46+00:00","updated_at":"2016-01-19T14:02:38+00:00","id":37,"github_login":null}}],"created_at":"2016-02-19T20:53:12+00:00","updated_at":"2016-02-19T20:53:12+00:00","summary":"The Playbook in Action is a python Flask application that simplifies the process of creating agile RFQs and RFPs for digital services for government Contracting Officers and Program Managers. This issue seeks to migrate the front-end design and user-interface from Bootstrap to the US Web Design Standards."},{"issue_url":"https://github.com/18F/deduplicate-tock-float/issues/1","github_repo":"https://github.com/18F/deduplicate-tock-float","start_price":3500,"start_datetime":"2016-02-24T18:00:00+00:00","end_datetime":"2016-02-26T18:00:00+00:00","title":"De-duplicate data from Tock and Float","description":"## Description \r\n\r\n18F uses Tock to track past staff project allocations and uses Float to predict future staff project allocations. Both systems contain very similar information but with very different temporal aspects: Tock contains historical data, while Float contains projected future data. However, the data elements are very similar.\r\n\r\nSince both applications are used for managing the business of 18F, it is critical that the common data elements between the two are regularly reconciled. For instance, analysis quickly breaks down if a project in Float has a `name` attribute that varies from the project `name` attribute in Tock.\r\n\r\nThis issue seeks to provide a command-line script that pulls data from Tock and Float and returns a list of possibly-duplicate project names.\r\nThe primary user of this application is 18F's internal manager of Tock and Float. The primary use case is running the on-demand via command line that checks for inconsistencies between Tock and Float across the following fields: \r\n\r\n(1) person names; \r\n\r\n(2) project names;\r\n\r\n(3) client names;  and \r\n\r\n(4) project --\u003e client associations.\r\n\r\nBoth applications have straightforward APIs.\r\n\r\n\r\n## Auction rules \r\n\r\nRegistered users on micropurchase.18f.gov may bid to deliver the requirements in this auction. The lowest bidder at the time the auction closes shall receive the award. The awarded bidder shall have five business days after notice of award to deliver the requirements. Upon successful completion of the requirements, 18F shall pay the winning bidder.\r\n\r\nAlso see our [policies and guidelines page](https://micropurchase.18f.gov/faq). \r\n\r\n## Acceptance criteria \r\n\r\nGiven the [Float](https://www.float.com/) API and the Tock API, https://tock.18f.gov/api/,\r\nWhen a user runs a Ruby command line script,\r\n\r\nThen it should return a list of project names\r\n that appear in both Tock and Float in any of the following portions of the \r\nTock/Float\r\n\t\r\n1) person names;\r\n\r\n2) project names;\r\n\r\n3) client names;\r\n\r\n(4) project --\u003e client\r\n\t\r\nand that the project names must be similar but not exact matches. \r\n\r\nThe fuzziness of the similar matches should be able to be set by a command line parameter.\r\n\r\n\r\n## General acceptance criteria \r\n\r\n- B or better Code Climate grade and 90% or higher test coverage for all modifications.\r\n- Tests adequately cover any new functionality.\r\n- Tests run on Travis-CI and do not break the build.\r\n\r\n## Resources\r\n\r\n- https://github.com/floatschedule/api\r\n- https://github.com/18F/tock#api\r\n\r\n\r\n## Deliverables\r\n\r\nA single pull request submitted to https://github.com/18F/tock with clear, descriptive commits that satisfy all of the above acceptance criteria.","id":11,"bids":[{"bidder_id":30,"auction_id":11,"amount":1649,"created_at":"2016-02-26T17:59:47+00:00","updated_at":"2016-02-26T17:59:47+00:00","id":173,"bidder":{"github_id":"387035","duns_number":"080033077","name":"Christian G. Warden","sam_account":true,"created_at":"2015-12-29T16:14:47+00:00","updated_at":"2016-01-11T03:15:25+00:00","id":30,"github_login":null}},{"bidder_id":44,"auction_id":11,"amount":1650,"created_at":"2016-02-26T17:59:46+00:00","updated_at":"2016-02-26T17:59:46+00:00","id":172,"bidder":{"github_id":"1451399","duns_number":"080014807","name":"Dan Siddoway","sam_account":true,"created_at":"2015-12-29T23:22:12+00:00","updated_at":"2016-01-29T18:07:33+00:00","id":44,"github_login":null}},{"bidder_id":161,"auction_id":11,"amount":1700,"created_at":"2016-02-26T17:59:29+00:00","updated_at":"2016-02-26T17:59:29+00:00","id":170,"bidder":{"github_id":"833570","duns_number":"07-944-1444","name":"Evan Rose","sam_account":true,"created_at":"2016-02-25T01:14:16+00:00","updated_at":"2016-02-25T15:09:02+00:00","id":161,"github_login":null}},{"bidder_id":30,"auction_id":11,"amount":1749,"created_at":"2016-02-26T17:59:25+00:00","updated_at":"2016-02-26T17:59:25+00:00","id":168,"bidder":{"github_id":"387035","duns_number":"080033077","name":"Christian G. Warden","sam_account":true,"created_at":"2015-12-29T16:14:47+00:00","updated_at":"2016-01-11T03:15:25+00:00","id":30,"github_login":null}},{"bidder_id":44,"auction_id":11,"amount":1750,"created_at":"2016-02-26T17:59:08+00:00","updated_at":"2016-02-26T17:59:08+00:00","id":166,"bidder":{"github_id":"1451399","duns_number":"080014807","name":"Dan Siddoway","sam_account":true,"created_at":"2015-12-29T23:22:12+00:00","updated_at":"2016-01-29T18:07:33+00:00","id":44,"github_login":null}},{"bidder_id":30,"auction_id":11,"amount":1895,"created_at":"2016-02-26T17:57:59+00:00","updated_at":"2016-02-26T17:57:59+00:00","id":161,"bidder":{"github_id":"387035","duns_number":"080033077","name":"Christian G. Warden","sam_account":true,"created_at":"2015-12-29T16:14:47+00:00","updated_at":"2016-01-11T03:15:25+00:00","id":30,"github_login":null}},{"bidder_id":161,"auction_id":11,"amount":1896,"created_at":"2016-02-26T17:57:57+00:00","updated_at":"2016-02-26T17:57:57+00:00","id":160,"bidder":{"github_id":"833570","duns_number":"07-944-1444","name":"Evan Rose","sam_account":true,"created_at":"2016-02-25T01:14:16+00:00","updated_at":"2016-02-25T15:09:02+00:00","id":161,"github_login":null}},{"bidder_id":30,"auction_id":11,"amount":1897,"created_at":"2016-02-26T17:57:18+00:00","updated_at":"2016-02-26T17:57:18+00:00","id":158,"bidder":{"github_id":"387035","duns_number":"080033077","name":"Christian G. Warden","sam_account":true,"created_at":"2015-12-29T16:14:47+00:00","updated_at":"2016-01-11T03:15:25+00:00","id":30,"github_login":null}},{"bidder_id":161,"auction_id":11,"amount":1898,"created_at":"2016-02-26T17:57:04+00:00","updated_at":"2016-02-26T17:57:04+00:00","id":157,"bidder":{"github_id":"833570","duns_number":"07-944-1444","name":"Evan Rose","sam_account":true,"created_at":"2016-02-25T01:14:16+00:00","updated_at":"2016-02-25T15:09:02+00:00","id":161,"github_login":null}},{"bidder_id":30,"auction_id":11,"amount":1899,"created_at":"2016-02-26T01:22:22+00:00","updated_at":"2016-02-26T01:22:22+00:00","id":138,"bidder":{"github_id":"387035","duns_number":"080033077","name":"Christian G. Warden","sam_account":true,"created_at":"2015-12-29T16:14:47+00:00","updated_at":"2016-01-11T03:15:25+00:00","id":30,"github_login":null}},{"bidder_id":65,"auction_id":11,"amount":1900,"created_at":"2016-02-26T00:20:59+00:00","updated_at":"2016-02-26T00:20:59+00:00","id":136,"bidder":{"github_id":"11858095","duns_number":"080024708","name":"Ry Bobko","sam_account":true,"created_at":"2016-01-04T20:57:17+00:00","updated_at":"2016-01-11T03:15:36+00:00","id":65,"github_login":null}},{"bidder_id":30,"auction_id":11,"amount":1999,"created_at":"2016-02-24T23:21:33+00:00","updated_at":"2016-02-24T23:21:33+00:00","id":128,"bidder":{"github_id":"387035","duns_number":"080033077","name":"Christian G. Warden","sam_account":true,"created_at":"2015-12-29T16:14:47+00:00","updated_at":"2016-01-11T03:15:25+00:00","id":30,"github_login":null}},{"bidder_id":65,"auction_id":11,"amount":2000,"created_at":"2016-02-24T18:52:37+00:00","updated_at":"2016-02-24T18:52:37+00:00","id":124,"bidder":{"github_id":"11858095","duns_number":"080024708","name":"Ry Bobko","sam_account":true,"created_at":"2016-01-04T20:57:17+00:00","updated_at":"2016-01-11T03:15:36+00:00","id":65,"github_login":null}}],"created_at":"2016-02-19T20:46:57+00:00","updated_at":"2016-02-19T20:46:57+00:00","summary":"This issue seeks to provide a command-line script that pulls data from Tock and Float and returns a list of possibly-duplicate project names."},{"issue_url":"https://github.com/18F/tock/issues/287","github_repo":"https://github.com/18F/tock","start_price":3500,"start_datetime":"2016-02-24T18:00:00+00:00","end_datetime":"2016-02-26T18:00:00+00:00","title":"Tock superusers should be able to enter 0-60 hour week","description":"### Description\r\n\r\nTock is a simple time tracking app that 18F employees use to report their time on a weekly basis. Currently, no user may enter more than 40 hours per week. This issue seeks to allow certain specified users of Tock to enter anywhere between 0 and 60 hours.\r\n\r\n### Auction rules\r\n\r\nRegistered users on micropurchase.18f.gov may bid to deliver the requirements in this auction. The lowest bidder at the time the auction closes shall receive the award. The awarded bidder shall have five business days to deliver the requirements. Upon successful completion of the requirements, 18F shall pay the winning bidder.\r\n\r\nAlso see our [policies and guidelines page](https://micropurchase.18f.gov/faq).\r\n\r\nNote: This auction is being re-run because the previous winner did not submit acceptable code. \r\n\r\nYou can view the previous auction [here](https://micropurchase.18f.gov/auctions/10).\r\n\r\n### Application-specific acceptance criteria\r\n\r\n- Given superuser privileges in Tock,\r\n\r\nWhen a superuser views in the admin panel a time card for any other user,\r\n\r\nThen the superuser would be able to select an option (e.g. check a box) which would allow any superuser to enter anywhere between 0 and 60 hours for a given week.\r\n\r\n- Given superuser privileges in Tock, \r\n\r\nWhen a superuser creates or edits a reporting period in the admin panel,\r\n\r\nThen the superuser can give access to users to users who may enter between 0 and 60 hours for that reporting period.\r\n\r\n### General acceptance criteria\r\n\r\n- B or better Code Climate grade and 90% or higher test coverage for all modifications.\r\n- Tests adequately cover any new functionality. Tests run on Travis-CI and do not break the build. \r\n- New features do not degrade accessibility (use pa11y/HTML Code Sniffer).\r\n\r\n### Resources\r\n\r\nInstructions for installing Tock locally and loading sample data:[https://github.com/18F/tock/blob/master/README.md#getting-started](https://github.com/18F/tock/blob/master/README.md#getting-started)\r\n\r\n### Deliverables\r\n\r\nA single pull request submitted to [https://github.com/18F/tock](https://github.com/18F/tock) with clear, descriptive commits that satisfy all of the above acceptance criteria.","id":12,"bids":[{"bidder_id":161,"auction_id":12,"amount":1500,"created_at":"2016-02-26T17:52:12+00:00","updated_at":"2016-02-26T17:52:12+00:00","id":152,"bidder":{"github_id":"833570","duns_number":"07-944-1444","name":"Evan Rose","sam_account":true,"created_at":"2016-02-25T01:14:16+00:00","updated_at":"2016-02-25T15:09:02+00:00","id":161,"github_login":null}},{"bidder_id":44,"auction_id":12,"amount":500,"created_at":"2016-02-26T17:07:41+00:00","updated_at":"2016-02-26T17:07:41+00:00","id":147,"bidder":{"github_id":"1451399","duns_number":"080014807","name":"Dan Siddoway","sam_account":true,"created_at":"2015-12-29T23:22:12+00:00","updated_at":"2016-01-29T18:07:33+00:00","id":44,"github_login":null}},{"bidder_id":90,"auction_id":12,"amount":2699,"created_at":"2016-02-25T23:34:38+00:00","updated_at":"2016-02-25T23:34:38+00:00","id":135,"bidder":{"github_id":"684965","duns_number":"080126095","name":"Joe Hand","sam_account":true,"created_at":"2016-01-11T18:33:42+00:00","updated_at":"2016-02-24T18:04:37+00:00","id":90,"github_login":null}},{"bidder_id":69,"auction_id":12,"amount":2000,"created_at":"2016-02-25T15:55:43+00:00","updated_at":"2016-02-25T15:55:43+00:00","id":131,"bidder":{"github_id":"15251877","duns_number":"079859219","name":"Daniel Connery","sam_account":true,"created_at":"2016-01-05T18:43:53+00:00","updated_at":"2016-01-11T03:15:51+00:00","id":69,"github_login":null}},{"bidder_id":37,"auction_id":12,"amount":580,"created_at":"2016-02-24T22:25:16+00:00","updated_at":"2016-02-24T22:25:16+00:00","id":126,"bidder":{"github_id":"461046","duns_number":"080039148","name":"Justin Duke","sam_account":true,"created_at":"2015-12-29T18:02:46+00:00","updated_at":"2016-01-19T14:02:38+00:00","id":37,"github_login":null}},{"bidder_id":158,"auction_id":12,"amount":299,"created_at":"2016-02-24T18:15:14+00:00","updated_at":"2016-02-24T18:15:14+00:00","id":121,"bidder":{"github_id":"14097154","duns_number":"08-003-3961","name":"Thought Object","sam_account":true,"created_at":"2016-02-24T18:03:07+00:00","updated_at":"2016-02-24T18:07:39+00:00","id":158,"github_login":null}}],"created_at":"2016-02-19T20:49:27+00:00","updated_at":"2016-02-19T20:49:27+00:00","summary":"Tock is a simple time tracking app that 18F employees use to report their time on a weekly basis. Currently, no user may enter more than 40 hours per week. This issue seeks to allow certain specified users of Tock to enter anywhere between 0 and 60 hours."},{"issue_url":"https://github.com/18F/micropurchase/issues/319","github_repo":"https://github.com/18F/micropurchase/","start_price":3500,"start_datetime":"2016-02-24T18:00:00+00:00","end_datetime":"2016-02-26T18:00:00+00:00","title":"Specify micro-purchase delivery deadline as a number of business days","description":"## Description \r\n\r\nCurrently when creating auctions in the micro-purchase admin panel, the admin must enter a delivery deadline. This is the deadline that the winning bidder has to deliver the requirements. This issue seeks to make it easier for site admins to enter this time.\r\n\r\n\u003cimg src=\"https://cloud.githubusercontent.com/assets/86790/13293972/e8fa37b0-daef-11e5-837a-9187b8fa56d2.png\" alt=\"screenshot of micro-purchase admin panel\" /\u003e\r\n\r\nInstead of entering the string \"March 4, 2016 5:00PM\", the admin should be able to enter an integer representing a number of business days after the auction end time. In this case, if the auction end time is February 26, 1:00PM, then March 4 is five business days afterwards.\r\n\r\n## Auction rules \r\n\r\nRegistered users on micropurchase.18f.gov may bid to deliver the requirements in this auction. The lowest bidder at the time the auction closes shall receive the award. The awarded bidder shall have five business days after notice of award to deliver the requirements. Upon successful completion of the requirements, 18F shall pay the winning bidder.\r\n\r\n## Application-specific acceptance criteria\r\n\r\n- In `/admin/auctions/new`, the \"Delivery deadline\" field should be a text box that accepts an integer (number of business days).\r\n- Upon submitting the form on `/admin/auctions/new`, the `delivery_deadline` attribute on the newly-created auction should be a date time representing the number of business days entered in the previous form.\r\n\r\n## General acceptance criteria \r\n\r\n- B or better code climate grade and 90% or higher test coverage for all modifications.\r\n- Tests adequately cover any new functionality.\r\n- Tests run on Travis-CI and do not break the build.\r\n- New features do not degrade accessibility (use pa11y/HTML Code Sniffer).\r\n\r\n## Resources\r\n\r\n- https://github.com/18F/micropurchase/issues/319\r\n- Look at `app/controllers/admin/auctions_controller.rb` to understand how auction models are created. Notice the use of the `CreateAuction` auction class.\r\n- It is recommended, but not required, to use [this gem](https://github.com/bokmann/business_time) for calculating business days.\r\n\r\n## Deliverables\r\n\r\nA single pull request submitted to https://github.com/18F/micropurchase with clear, descriptive commits that satisfy all of the above acceptance criteria.\r\n","id":16,"bids":[{"bidder_id":161,"auction_id":16,"amount":1000,"created_at":"2016-02-26T17:52:35+00:00","updated_at":"2016-02-26T17:52:35+00:00","id":153,"bidder":{"github_id":"833570","duns_number":"07-944-1444","name":"Evan Rose","sam_account":true,"created_at":"2016-02-25T01:14:16+00:00","updated_at":"2016-02-25T15:09:02+00:00","id":161,"github_login":null}},{"bidder_id":44,"auction_id":16,"amount":200,"created_at":"2016-02-26T17:08:03+00:00","updated_at":"2016-02-26T17:08:03+00:00","id":148,"bidder":{"github_id":"1451399","duns_number":"080014807","name":"Dan Siddoway","sam_account":true,"created_at":"2015-12-29T23:22:12+00:00","updated_at":"2016-01-29T18:07:33+00:00","id":44,"github_login":null}},{"bidder_id":49,"auction_id":16,"amount":640,"created_at":"2016-02-26T15:52:24+00:00","updated_at":"2016-02-26T15:52:24+00:00","id":144,"bidder":{"github_id":"688980","duns_number":"313210696","name":"Mila Frerichs","sam_account":true,"created_at":"2015-12-30T06:05:37+00:00","updated_at":"2016-01-11T03:15:33+00:00","id":49,"github_login":null}},{"bidder_id":69,"auction_id":16,"amount":2000,"created_at":"2016-02-25T15:56:53+00:00","updated_at":"2016-02-25T15:56:53+00:00","id":132,"bidder":{"github_id":"15251877","duns_number":"079859219","name":"Daniel Connery","sam_account":true,"created_at":"2016-01-05T18:43:53+00:00","updated_at":"2016-01-11T03:15:51+00:00","id":69,"github_login":null}},{"bidder_id":62,"auction_id":16,"amount":1,"created_at":"2016-02-25T14:56:02+00:00","updated_at":"2016-02-25T14:56:02+00:00","id":129,"bidder":{"github_id":"16545190","duns_number":"130477032","name":"NuAxis Admin","sam_account":true,"created_at":"2016-01-04T18:34:39+00:00","updated_at":"2016-01-11T03:15:02+00:00","id":62,"github_login":null}},{"bidder_id":37,"auction_id":16,"amount":590,"created_at":"2016-02-24T22:22:08+00:00","updated_at":"2016-02-24T22:22:08+00:00","id":125,"bidder":{"github_id":"461046","duns_number":"080039148","name":"Justin Duke","sam_account":true,"created_at":"2015-12-29T18:02:46+00:00","updated_at":"2016-01-19T14:02:38+00:00","id":37,"github_login":null}},{"bidder_id":65,"auction_id":16,"amount":650,"created_at":"2016-02-24T18:49:39+00:00","updated_at":"2016-02-24T18:49:39+00:00","id":123,"bidder":{"github_id":"11858095","duns_number":"080024708","name":"Ry Bobko","sam_account":true,"created_at":"2016-01-04T20:57:17+00:00","updated_at":"2016-01-11T03:15:36+00:00","id":65,"github_login":null}},{"bidder_id":30,"auction_id":16,"amount":3200,"created_at":"2016-02-24T18:23:46+00:00","updated_at":"2016-02-24T18:23:46+00:00","id":122,"bidder":{"github_id":"387035","duns_number":"080033077","name":"Christian G. Warden","sam_account":true,"created_at":"2015-12-29T16:14:47+00:00","updated_at":"2016-01-11T03:15:25+00:00","id":30,"github_login":null}},{"bidder_id":158,"auction_id":16,"amount":399,"created_at":"2016-02-24T18:09:45+00:00","updated_at":"2016-02-24T18:09:45+00:00","id":119,"bidder":{"github_id":"14097154","duns_number":"08-003-3961","name":"Thought Object","sam_account":true,"created_at":"2016-02-24T18:03:07+00:00","updated_at":"2016-02-24T18:07:39+00:00","id":158,"github_login":null}}],"created_at":"2016-02-24T17:18:10+00:00","updated_at":"2016-02-24T17:18:10+00:00","summary":"Currently when creating auctions in the micro-purchase admin panel, the admin must enter a delivery deadline. This is the deadline that the winning bidder has to deliver the requirements. This issue seeks to make it easier for site admins to enter this time."},{"issue_url":"https://github.com/18F/travel-form/issues/1","github_repo":"https://github.com/18F/travel-form","start_price":3500,"start_datetime":"2016-02-24T18:00:00+00:00","end_datetime":"2016-02-26T18:00:00+00:00","title":"Travel Form and Email Request Automation","description":"## Description \r\n\r\n18F travel requests must be authorized by supervisors, which is currently done via email. Certain information is required for the supervisor in order to approve or deny the request and the email is currently templated, but entered manually by the requester. This issue seeks the creation of a web form to collect the information required in the web form and generates an email to send to the supervisor.   An email must be generated in order to confirm travel dates. \r\n\r\n\r\n## Auction rules \r\n\r\nRegistered users on micropurchase.18f.gov may bid to deliver the requirements in this auction. The lowest bidder at the time the auction closes shall receive the award. The awarded bidder shall have five business days after notice of award to deliver the requirements. Upon successful completion of the requirements, 18F shall pay the winning bidder.\r\n\r\nAlso see our [policies and guidelines page](https://micropurchase.18f.gov/faq). \r\n\r\n## Acceptance criteria \r\n\r\nGiven an 18F employee needs to send a travel request,\r\n\r\nWhen they log on to the webform pages,\r\n\r\nThen they will see the following fields, all of which will be required:\r\n\r\n- Requestor Name [Text]\r\n- Requestor Email [Email]\r\n- Billability  [Dropdown]\r\n   --Two Options: \r\n    --BILLABLE \r\n    --NONBILLABLE \r\n- Tock Project Name [Text] [Help text: - Exact Name of the Tock Project]\r\n- Tock Project ID. [Text] [Help Text: - Please lookup tock project here: https://tock.18f.gov/projects/]\r\n- Client Email  [Email] [Help Text: Or supervisor if nonbillable]\r\n- Home Location  [Text] [Help Text: - Where you are usually located]\r\n- Work Location [Text]  [Help Text: Where you will be travelling to]\r\n- Work to be done [Text] [Help Text: What you will be working on ]\r\n- Departure Date [Date]\r\n- Return Date [Date]\r\n- First Day of Travel Work Date [Date]\r\n- When a user submits the information\r\n- Then the web form will validate the entries to ensure they are of appropriate length and do not contain illegal characters.\r\n\r\nGiven that the entered form information meets the validation criteria\r\n\r\nWhen the form is submitted\r\nThen an email is sent to the Client Email\r\n\r\nAnd a reply-to field including the “Requestor Email” and “18fTravelAuths@gsa.gov”\r\n\r\nAnd contains a subject in the Following Format using the information from the form inputs:\r\n\r\n \"{Billability} - {Tock Project Name} - #{Tock Project ID} -- {Departure_Date} - {Return Date}\"\r\n \r\n   \r\n\r\n**Subsequently, the body of the email will be generated using the information from the form inputs:**\r\n \r\n\r\n--\r\n\r\nHello,\r\n\t\r\nI request approval to travel from {Home Location} to {Work Location}. The dates of travel are {Departure Date} - {Return Date}.  I will depart the {Departure Date}, to arrive in time for {Work to be done} scheduled for {First Day of Travel Work Date}.  I will return to {Home Location} on {Return Date}. \r\n\r\nPlease reply with your approval, or with any subsequent clarifications you may have.\r\n\r\n Many thanks,\r\n\r\n {Requestor Name}\r\n\r\n\r\n----\r\n\r\n \r\n   \r\n\r\n## Deliverables\r\n\r\nA single pull request submitted to https://github.com/18F/tock with clear, descriptive commits that satisfy all of the above acceptance criteria.","id":14,"bids":[{"bidder_id":44,"auction_id":14,"amount":400,"created_at":"2016-02-26T17:59:06+00:00","updated_at":"2016-02-26T17:59:06+00:00","id":165,"bidder":{"github_id":"1451399","duns_number":"080014807","name":"Dan Siddoway","sam_account":true,"created_at":"2015-12-29T23:22:12+00:00","updated_at":"2016-01-29T18:07:33+00:00","id":44,"github_login":null}},{"bidder_id":161,"auction_id":14,"amount":449,"created_at":"2016-02-26T17:55:22+00:00","updated_at":"2016-02-26T17:55:22+00:00","id":155,"bidder":{"github_id":"833570","duns_number":"07-944-1444","name":"Evan Rose","sam_account":true,"created_at":"2016-02-25T01:14:16+00:00","updated_at":"2016-02-25T15:09:02+00:00","id":161,"github_login":null}},{"bidder_id":90,"auction_id":14,"amount":450,"created_at":"2016-02-26T15:50:31+00:00","updated_at":"2016-02-26T15:50:31+00:00","id":143,"bidder":{"github_id":"684965","duns_number":"080126095","name":"Joe Hand","sam_account":true,"created_at":"2016-01-11T18:33:42+00:00","updated_at":"2016-02-24T18:04:37+00:00","id":90,"github_login":null}},{"bidder_id":37,"auction_id":14,"amount":475,"created_at":"2016-02-26T06:21:31+00:00","updated_at":"2016-02-26T06:21:31+00:00","id":140,"bidder":{"github_id":"461046","duns_number":"080039148","name":"Justin Duke","sam_account":true,"created_at":"2015-12-29T18:02:46+00:00","updated_at":"2016-01-19T14:02:38+00:00","id":37,"github_login":null}},{"bidder_id":158,"auction_id":14,"amount":500,"created_at":"2016-02-24T18:11:16+00:00","updated_at":"2016-02-24T18:11:16+00:00","id":120,"bidder":{"github_id":"14097154","duns_number":"08-003-3961","name":"Thought Object","sam_account":true,"created_at":"2016-02-24T18:03:07+00:00","updated_at":"2016-02-24T18:07:39+00:00","id":158,"github_login":null}}],"created_at":"2016-02-19T21:00:08+00:00","updated_at":"2016-02-19T21:00:08+00:00","summary":"Travel requests must be authorized by supervisors, which is currently done via email. Certain information is required for the supervisor in order to approve or deny the request and the email is currently templated, but entered manually by the requester. This issue seeks a web form to collect the information required in the web form and generates an email to send to the supervisor.   An email must be generated in order to confirm travel dates. "},{"issue_url":"https://github.com/18F/tock/issues/288","github_repo":"https://github.com/18f/tock","start_price":3500,"start_datetime":"2016-01-25T18:00:00+00:00","end_datetime":"2016-01-26T18:00:00+00:00","title":"Save hours in Tock throughout the week ","description":"## Description\r\n\r\nTock is a simple time tracking app that 18F employees use to report their time on a weekly basis. The application also provides some light data visualization tools that allow users to look at what users have logged time to a project, as well as what projects to which a user has logged time.  This issue seeks to allow users to update their time cards throughout the week.\r\n\r\n## Auction rules \r\n\r\nRegistered users on micropurchase.18f.gov may bid to deliver the requirements in this auction. The lowest bidder at the time the auction closes shall receive the award. The awarded bidder shall have five business days to deliver the requirements. Upon successful completion of the requirements, 18F shall pay the winning bidder.\r\n\r\nAlso see our [policies and guidelines page](https://micropurchase.18f.gov/faq). \r\n\r\nNote: This auction is being re-run because the original winning vendor was not able to deliver the requirements within the required time frame. You can view the previous auction [here](https://micropurchase.18f.gov/auctions/4).\r\n\r\n## Application-specific acceptance criteria\r\n\r\n- A user may save a partially completed time sheet.\r\n- The user has the option to save a time card without submitting (e.g. via a “save time card” button).\r\n- The user has the option to submit a time card (e.g. through the existing “submit time card” button).\r\n- Time cards should have a status flag (e.g. a column added to the hours table/model) which indicates the following states:\r\n-     time card has not been submitted\r\n-     time card has been submitted\r\n- The API endpoints that publish time card data exclude time cards that have not been submitted.\r\n- Other parts of the application that rely on time card data only reference submitted time card data.\r\n- Create a new API endpoint for time cards that have not been submitted.\r\n\r\n## General acceptance criteria\r\n\r\n- B or better code climate grade and 90% or higher test coverage for all modifications.\r\n- Tests adequately cover any new functionality.\r\n- Tests run on Travis-CI and do not break the build.\r\n- New features do not degrade accessibility (use pa11y/HTML Code Sniffer).\r\n\r\n## Resources\r\n\r\nInstructions for installing Tock locally and loading sample data: https://github.com/18F/tock/blob/master/README.md#getting-started\r\n\r\n## Deliverables\r\n\r\nA single pull request submitted to https://github.com/18F/tock with clear, descriptive commits that satisfy all of the above acceptance criteria.\r\n","id":9,"bids":[{"bidder_id":36,"auction_id":9,"amount":492,"created_at":"2016-01-26T17:59:52+00:00","updated_at":"2016-01-26T17:59:52+00:00","id":118,"bidder":{"github_id":"1060893","duns_number":"080037478","name":"brendan sudol","sam_account":true,"created_at":"2015-12-29T17:39:36+00:00","updated_at":"2016-01-11T00:44:39+00:00","id":36,"github_login":null}},{"bidder_id":34,"auction_id":9,"amount":600,"created_at":"2016-01-26T15:39:17+00:00","updated_at":"2016-01-26T15:39:17+00:00","id":117,"bidder":{"github_id":"6887045","duns_number":"078327018","name":null,"sam_account":true,"created_at":"2015-12-29T17:29:09+00:00","updated_at":"2016-01-11T00:44:39+00:00","id":34,"github_login":null}},{"bidder_id":52,"auction_id":9,"amount":650,"created_at":"2016-01-26T15:32:23+00:00","updated_at":"2016-01-26T15:32:23+00:00","id":116,"bidder":{"github_id":"445875","duns_number":"08-011-5718","name":"Joshua Tauberer","sam_account":true,"created_at":"2015-12-30T13:59:52+00:00","updated_at":"2016-01-11T17:52:30+00:00","id":52,"github_login":null}},{"bidder_id":34,"auction_id":9,"amount":700,"created_at":"2016-01-26T15:03:22+00:00","updated_at":"2016-01-26T15:03:22+00:00","id":114,"bidder":{"github_id":"6887045","duns_number":"078327018","name":null,"sam_account":true,"created_at":"2015-12-29T17:29:09+00:00","updated_at":"2016-01-11T00:44:39+00:00","id":34,"github_login":null}},{"bidder_id":37,"auction_id":9,"amount":750,"created_at":"2016-01-26T04:47:33+00:00","updated_at":"2016-01-26T04:47:33+00:00","id":113,"bidder":{"github_id":"461046","duns_number":"080039148","name":"Justin Duke","sam_account":true,"created_at":"2015-12-29T18:02:46+00:00","updated_at":"2016-01-19T14:02:38+00:00","id":37,"github_login":null}},{"bidder_id":34,"auction_id":9,"amount":800,"created_at":"2016-01-26T03:02:15+00:00","updated_at":"2016-01-26T03:02:15+00:00","id":111,"bidder":{"github_id":"6887045","duns_number":"078327018","name":null,"sam_account":true,"created_at":"2015-12-29T17:29:09+00:00","updated_at":"2016-01-11T00:44:39+00:00","id":34,"github_login":null}},{"bidder_id":52,"auction_id":9,"amount":860,"created_at":"2016-01-25T19:56:25+00:00","updated_at":"2016-01-25T19:56:25+00:00","id":110,"bidder":{"github_id":"445875","duns_number":"08-011-5718","name":"Joshua Tauberer","sam_account":true,"created_at":"2015-12-30T13:59:52+00:00","updated_at":"2016-01-11T17:52:30+00:00","id":52,"github_login":null}},{"bidder_id":34,"auction_id":9,"amount":940,"created_at":"2016-01-25T19:46:32+00:00","updated_at":"2016-01-25T19:46:32+00:00","id":109,"bidder":{"github_id":"6887045","duns_number":"078327018","name":null,"sam_account":true,"created_at":"2015-12-29T17:29:09+00:00","updated_at":"2016-01-11T00:44:39+00:00","id":34,"github_login":null}},{"bidder_id":52,"auction_id":9,"amount":1101,"created_at":"2016-01-25T19:44:17+00:00","updated_at":"2016-01-25T19:44:17+00:00","id":107,"bidder":{"github_id":"445875","duns_number":"08-011-5718","name":"Joshua Tauberer","sam_account":true,"created_at":"2015-12-30T13:59:52+00:00","updated_at":"2016-01-11T17:52:30+00:00","id":52,"github_login":null}},{"bidder_id":34,"auction_id":9,"amount":1800,"created_at":"2016-01-25T19:28:40+00:00","updated_at":"2016-01-25T19:28:40+00:00","id":105,"bidder":{"github_id":"6887045","duns_number":"078327018","name":null,"sam_account":true,"created_at":"2015-12-29T17:29:09+00:00","updated_at":"2016-01-11T00:44:39+00:00","id":34,"github_login":null}},{"bidder_id":52,"auction_id":9,"amount":3250,"created_at":"2016-01-25T19:18:09+00:00","updated_at":"2016-01-25T19:18:09+00:00","id":100,"bidder":{"github_id":"445875","duns_number":"08-011-5718","name":"Joshua Tauberer","sam_account":true,"created_at":"2015-12-30T13:59:52+00:00","updated_at":"2016-01-11T17:52:30+00:00","id":52,"github_login":null}}],"created_at":"2016-01-25T13:42:40+00:00","updated_at":"2016-01-25T13:42:40+00:00","summary":"Tock is a simple time tracking app that 18F employees use to report their time on a weekly basis. The application also provides some light data visualization tools that allow users to look at what users have logged time to a project, as well as what projects to which a user has logged time.  This issue seeks to allow users to update their time cards throughout the week."},{"issue_url":"https://github.com/18F/tock/issues/287","github_repo":"https://github.com/18f/tock","start_price":3500,"start_datetime":"2016-01-25T18:00:00+00:00","end_datetime":"2016-01-26T18:00:00+00:00","title":"Tock superusers should be able to enter 0-60 hour weeks","description":"## Description\r\n\r\nTock is a simple time tracking app that 18F employees use to report their time on a weekly \r\nbasis. Currently, no user may enter more than 40 hours per week. This issue seeks to allow certain specified users of Tock to enter anywhere between 0 and 60 hours.\r\n\r\n## Auction rules \r\n\r\nRegistered users on micropurchase.18f.gov may bid to deliver the requirements in this auction. The lowest bidder at the time the auction closes shall receive the award. The awarded bidder shall have five business days to deliver the requirements. Upon successful completion of the requirements, 18F shall pay the winning bidder.\r\n\r\nAlso see our [policies and guidelines page](https://micropurchase.18f.gov/faq). \r\n\r\n\r\nNote: This auction is being re-run because the original winning vendor was not able to deliver the requirements within the required time frame. You can view the previous auction [here](https://micropurchase.18f.gov/auctions/5).\r\n\r\n## Application-specific acceptance criteria\r\n\r\nA superuser can view in the admin panel a time card for any other user and select an option (e.g. check a box) which would allow any superuser to enter anywhere between 0 and 60 hours for a given week.\r\nA superuser, when creating or editing a reporting period in the admin panel, can select users who may enter between 0 and 60 hours for that reporting period.\r\n\r\n## General acceptance criteria\r\n\r\nB or better code climate grade and 90% or higher test coverage for all modifications.\r\nTests adequately cover any new functionality.\r\nTests run on Travis-CI and do not break the build.\r\nNew features do not degrade accessibility (use pa11y/HTML Code Sniffer).\r\n\r\n## Resources\r\n\r\nInstructions for installing Tock locally and loading sample data: https://github.com/18F/tock/blob/master/README.md#getting-started\r\n\r\n## Deliverables\r\n\r\nA single pull request submitted to https://github.com/18F/tock with clear, descriptive commits that satisfy all of the above acceptance criteria.","id":10,"bids":[{"bidder_id":34,"auction_id":10,"amount":600,"created_at":"2016-01-26T15:03:42+00:00","updated_at":"2016-01-26T15:03:42+00:00","id":115,"bidder":{"github_id":"6887045","duns_number":"078327018","name":null,"sam_account":true,"created_at":"2015-12-29T17:29:09+00:00","updated_at":"2016-01-11T00:44:39+00:00","id":34,"github_login":null}},{"bidder_id":37,"auction_id":10,"amount":675,"created_at":"2016-01-26T04:46:52+00:00","updated_at":"2016-01-26T04:46:52+00:00","id":112,"bidder":{"github_id":"461046","duns_number":"080039148","name":"Justin Duke","sam_account":true,"created_at":"2015-12-29T18:02:46+00:00","updated_at":"2016-01-19T14:02:38+00:00","id":37,"github_login":null}},{"bidder_id":34,"auction_id":10,"amount":700,"created_at":"2016-01-25T19:46:06+00:00","updated_at":"2016-01-25T19:46:06+00:00","id":108,"bidder":{"github_id":"6887045","duns_number":"078327018","name":null,"sam_account":true,"created_at":"2015-12-29T17:29:09+00:00","updated_at":"2016-01-11T00:44:39+00:00","id":34,"github_login":null}},{"bidder_id":52,"auction_id":10,"amount":1001,"created_at":"2016-01-25T19:43:04+00:00","updated_at":"2016-01-25T19:43:04+00:00","id":106,"bidder":{"github_id":"445875","duns_number":"08-011-5718","name":"Joshua Tauberer","sam_account":true,"created_at":"2015-12-30T13:59:52+00:00","updated_at":"2016-01-11T17:52:30+00:00","id":52,"github_login":null}},{"bidder_id":110,"auction_id":10,"amount":1800,"created_at":"2016-01-25T19:27:07+00:00","updated_at":"2016-01-25T19:27:07+00:00","id":104,"bidder":{"github_id":"13643929","duns_number":"079699512","name":"Cntient","sam_account":true,"created_at":"2016-01-17T05:37:46+00:00","updated_at":"2016-02-02T21:15:34+00:00","id":110,"github_login":null}},{"bidder_id":34,"auction_id":10,"amount":1850,"created_at":"2016-01-25T19:24:58+00:00","updated_at":"2016-01-25T19:24:58+00:00","id":103,"bidder":{"github_id":"6887045","duns_number":"078327018","name":null,"sam_account":true,"created_at":"2015-12-29T17:29:09+00:00","updated_at":"2016-01-11T00:44:39+00:00","id":34,"github_login":null}},{"bidder_id":30,"auction_id":10,"amount":2500,"created_at":"2016-01-25T19:18:40+00:00","updated_at":"2016-01-25T19:18:40+00:00","id":101,"bidder":{"github_id":"387035","duns_number":"080033077","name":"Christian G. Warden","sam_account":true,"created_at":"2015-12-29T16:14:47+00:00","updated_at":"2016-01-11T03:15:25+00:00","id":30,"github_login":null}},{"bidder_id":52,"auction_id":10,"amount":2501,"created_at":"2016-01-25T19:12:29+00:00","updated_at":"2016-01-25T19:12:29+00:00","id":98,"bidder":{"github_id":"445875","duns_number":"08-011-5718","name":"Joshua Tauberer","sam_account":true,"created_at":"2015-12-30T13:59:52+00:00","updated_at":"2016-01-11T17:52:30+00:00","id":52,"github_login":null}},{"bidder_id":30,"auction_id":10,"amount":3499,"created_at":"2016-01-25T18:01:38+00:00","updated_at":"2016-01-25T18:01:38+00:00","id":92,"bidder":{"github_id":"387035","duns_number":"080033077","name":"Christian G. Warden","sam_account":true,"created_at":"2015-12-29T16:14:47+00:00","updated_at":"2016-01-11T03:15:25+00:00","id":30,"github_login":null}}],"created_at":"2016-01-25T13:46:31+00:00","updated_at":"2016-01-25T13:46:31+00:00","summary":"Tock is a simple time tracking app that 18F employees use to report their time on a weekly \r\nbasis. Currently, no user may enter more than 40 hours per week. This issue seeks to allow certain specified users of Tock to enter anywhere between 0 and 60 hours."},{"issue_url":"https://github.com/18F/procurement-glossary/issues/5","github_repo":"https://github.com/18F/procurement-glossary","start_price":3500,"start_datetime":"2016-01-25T18:00:00+00:00","end_datetime":"2016-01-26T18:00:00+00:00","title":"Convert FAI Glossary PDF into YAML data","description":"## Description \r\n\r\nThe Federal Acquisition Institute has a [“master glossary\"](https://www.fai.gov/drupal/sites/default/files/FAI_Acquisition_Glossary_021913%20Master%20Glossary.pdf). The master glossary currently has many definitions in a tabular form (and in PDF), but 18F has a need to convert these definitions into a yaml file. \r\n\r\n\r\nAmong other use cases, 18F uses these definitions to allow for quick reference of defined terms in slack (see screenshot).\r\n\r\nThis issue seeks to create a YAML file of the table contained within FAI Acquisition Glossary PDF.\r\n\r\n\u003cimg alt=\"Screen shot of slack usage of `charlie define PWS`\" src=\"https://cloud.githubusercontent.com/assets/4153048/12520133/c312e2d4-c110-11e5-8aab-574bdf0b6b15.png\"\u003e\r\n\r\n## Auction rules \r\n\r\nRegistered users on micropurchase.18f.gov may bid to deliver the requirements in this auction. The lowest bidder at the time the auction closes shall receive the award. The awarded bidder shall have five business days to deliver the requirements. Upon successful completion of the requirements, 18F shall pay the winning bidder.\r\n\r\nAlso see our [policies and guidelines page](https://micropurchase.18f.gov/faq). \r\n\r\n## Application-specific acceptance criteria \r\n\r\n- A separate `fai.yml` file formatted substantially similar to the yaml file currently in the https://github.com/18F/procurement-glossary/blob/master/abbreviations.yml\r\n- Where the glossary has a cross-reference (see screenshot below), the full definition should be included in the `description` field and the longform of the definition should be included in the `longform` field. \r\n- A brief narrative of the methodology (including any custom scripts) used to create the yaml file. \r\n\r\n\u003cimg alt=\"Screen shot of FAI glossary including BPA\" src=\"https://cloud.githubusercontent.com/assets/4153048/12520134/c3147b94-c110-11e5-8b49-739e572d17ee.png\"\u003e\r\n\r\n## General acceptance criteria\r\n\r\n- B or better code climate grade and 90% or higher test coverage for all modifications.\r\n- Tests adequately cover any new functionality.\r\n- Tests run on Travis-CI and do not break the build.\r\nNew features do not degrade accessibility (use pa11y/HTML Code Sniffer).\r\n\r\n\r\n## Resources\r\n\r\n- https://github.com/18F/procurement-glossary/issues/5\r\n\r\n## Deliverables\r\n\r\nA single pull request submitted to https://github.com/18F/procurement-glossary with clear, descriptive commits that satisfy all of the above acceptance criteria.\r\n","id":8,"bids":[{"bidder_id":110,"auction_id":8,"amount":1,"created_at":"2016-01-25T19:22:10+00:00","updated_at":"2016-01-25T19:22:10+00:00","id":102,"bidder":{"github_id":"13643929","duns_number":"079699512","name":"Cntient","sam_account":true,"created_at":"2016-01-17T05:37:46+00:00","updated_at":"2016-02-02T21:15:34+00:00","id":110,"github_login":null}},{"bidder_id":30,"auction_id":8,"amount":1500,"created_at":"2016-01-25T19:14:02+00:00","updated_at":"2016-01-25T19:14:02+00:00","id":99,"bidder":{"github_id":"387035","duns_number":"080033077","name":"Christian G. Warden","sam_account":true,"created_at":"2015-12-29T16:14:47+00:00","updated_at":"2016-01-11T03:15:25+00:00","id":30,"github_login":null}},{"bidder_id":52,"auction_id":8,"amount":1501,"created_at":"2016-01-25T19:08:45+00:00","updated_at":"2016-01-25T19:08:45+00:00","id":97,"bidder":{"github_id":"445875","duns_number":"08-011-5718","name":"Joshua Tauberer","sam_account":true,"created_at":"2015-12-30T13:59:52+00:00","updated_at":"2016-01-11T17:52:30+00:00","id":52,"github_login":null}},{"bidder_id":30,"auction_id":8,"amount":1999,"created_at":"2016-01-25T18:39:55+00:00","updated_at":"2016-01-25T18:39:55+00:00","id":96,"bidder":{"github_id":"387035","duns_number":"080033077","name":"Christian G. Warden","sam_account":true,"created_at":"2015-12-29T16:14:47+00:00","updated_at":"2016-01-11T03:15:25+00:00","id":30,"github_login":null}},{"bidder_id":65,"auction_id":8,"amount":2000,"created_at":"2016-01-25T18:36:47+00:00","updated_at":"2016-01-25T18:36:47+00:00","id":95,"bidder":{"github_id":"11858095","duns_number":"080024708","name":"Ry Bobko","sam_account":true,"created_at":"2016-01-04T20:57:17+00:00","updated_at":"2016-01-11T03:15:36+00:00","id":65,"github_login":null}},{"bidder_id":30,"auction_id":8,"amount":2249,"created_at":"2016-01-25T18:12:01+00:00","updated_at":"2016-01-25T18:12:01+00:00","id":94,"bidder":{"github_id":"387035","duns_number":"080033077","name":"Christian G. Warden","sam_account":true,"created_at":"2015-12-29T16:14:47+00:00","updated_at":"2016-01-11T03:15:25+00:00","id":30,"github_login":null}},{"bidder_id":110,"auction_id":8,"amount":2250,"created_at":"2016-01-25T18:10:28+00:00","updated_at":"2016-01-25T18:10:28+00:00","id":93,"bidder":{"github_id":"13643929","duns_number":"079699512","name":"Cntient","sam_account":true,"created_at":"2016-01-17T05:37:46+00:00","updated_at":"2016-02-02T21:15:34+00:00","id":110,"github_login":null}},{"bidder_id":30,"auction_id":8,"amount":3499,"created_at":"2016-01-25T18:01:15+00:00","updated_at":"2016-01-25T18:01:15+00:00","id":91,"bidder":{"github_id":"387035","duns_number":"080033077","name":"Christian G. Warden","sam_account":true,"created_at":"2015-12-29T16:14:47+00:00","updated_at":"2016-01-11T03:15:25+00:00","id":30,"github_login":null}}],"created_at":"2016-01-25T13:12:45+00:00","updated_at":"2016-01-25T13:12:45+00:00","summary":"The Federal Acquisition Institute has a [“master glossary\"](https://www.fai.gov/drupal/sites/default/files/FAI_Acquisition_Glossary_021913%20Master%20Glossary.pdf). The master glossary currently has many definitions in a tabular form (and in PDF), but 18F has a need to convert these definitions into a yaml file. \r\n\r\n"},{"issue_url":"https://github.com/18F/micropurchase/issues/216","github_repo":"https://github.com/18F/micropurchase/","start_price":3500,"start_datetime":"2016-01-11T18:00:00+00:00","end_datetime":"2016-01-12T22:00:00+00:00","title":"Fix spacing in micro-purchase auction details page","description":"## Description \r\n\r\nmicropurchase.18f.gov is the site you are using right now to view and bid on micro-purchase opportunities with 18F. This issue seeks to improve the UI by fixing vertical spacing on the auction details page.\r\n\r\n## Auction rules \r\n\r\nRegistered users on micropurchase.18f.gov may bid to deliver the requirements in this auction. The lowest bidder at the time the auction closes shall receive the award. The awarded bidder shall have five business days after notice of award to deliver the requirements. Upon successful completion of the requirements, 18F shall pay the winning bidder.\r\n\r\n## Application-specific acceptance criteria\r\n\r\n- The vertical spacing between elements in the auction description of the auction details page (controller: AuctionsController, action: index) is significantly reduced (e.g. the spacing should be no greater than 30px).\r\n\r\n## General acceptance criteria \r\n\r\n- B or better code climate grade and 90% or higher test coverage for all modifications.\r\n- Tests adequately cover any new functionality.\r\n- Tests run on Travis-CI and do not break the build.\r\n- New features do not degrade accessibility (use pa11y/HTML Code Sniffer).\r\n\r\n## Resources\r\n\r\n- https://github.com/18F/micropurchase/issues/216\r\n\r\n## Deliverables\r\n\r\nA single pull request submitted to https://github.com/18F/micropurchase with clear, descriptive commits that satisfy all of the above acceptance criteria.\r\n","id":6,"bids":[{"bidder_id":30,"auction_id":6,"amount":350,"created_at":"2016-01-12T21:59:53+00:00","updated_at":"2016-01-12T21:59:53+00:00","id":90,"bidder":{"github_id":"387035","duns_number":"080033077","name":"Christian G. Warden","sam_account":true,"created_at":"2015-12-29T16:14:47+00:00","updated_at":"2016-01-11T03:15:25+00:00","id":30,"github_login":null}},{"bidder_id":36,"auction_id":6,"amount":352,"created_at":"2016-01-12T21:59:27+00:00","updated_at":"2016-01-12T21:59:27+00:00","id":89,"bidder":{"github_id":"1060893","duns_number":"080037478","name":"brendan sudol","sam_account":true,"created_at":"2015-12-29T17:39:36+00:00","updated_at":"2016-01-11T00:44:39+00:00","id":36,"github_login":null}},{"bidder_id":30,"auction_id":6,"amount":400,"created_at":"2016-01-12T21:47:02+00:00","updated_at":"2016-01-12T21:47:02+00:00","id":86,"bidder":{"github_id":"387035","duns_number":"080033077","name":"Christian G. Warden","sam_account":true,"created_at":"2015-12-29T16:14:47+00:00","updated_at":"2016-01-11T03:15:25+00:00","id":30,"github_login":null}},{"bidder_id":52,"auction_id":6,"amount":401,"created_at":"2016-01-12T20:01:53+00:00","updated_at":"2016-01-12T20:01:53+00:00","id":83,"bidder":{"github_id":"445875","duns_number":"08-011-5718","name":"Joshua Tauberer","sam_account":true,"created_at":"2015-12-30T13:59:52+00:00","updated_at":"2016-01-11T17:52:30+00:00","id":52,"github_login":null}},{"bidder_id":30,"auction_id":6,"amount":495,"created_at":"2016-01-12T15:44:10+00:00","updated_at":"2016-01-12T15:44:10+00:00","id":80,"bidder":{"github_id":"387035","duns_number":"080033077","name":"Christian G. Warden","sam_account":true,"created_at":"2015-12-29T16:14:47+00:00","updated_at":"2016-01-11T03:15:25+00:00","id":30,"github_login":null}},{"bidder_id":69,"auction_id":6,"amount":500,"created_at":"2016-01-12T14:45:27+00:00","updated_at":"2016-01-12T14:45:27+00:00","id":77,"bidder":{"github_id":"15251877","duns_number":"079859219","name":"Daniel Connery","sam_account":true,"created_at":"2016-01-05T18:43:53+00:00","updated_at":"2016-01-11T03:15:51+00:00","id":69,"github_login":null}},{"bidder_id":52,"auction_id":6,"amount":501,"created_at":"2016-01-12T13:12:34+00:00","updated_at":"2016-01-12T13:12:34+00:00","id":74,"bidder":{"github_id":"445875","duns_number":"08-011-5718","name":"Joshua Tauberer","sam_account":true,"created_at":"2015-12-30T13:59:52+00:00","updated_at":"2016-01-11T17:52:30+00:00","id":52,"github_login":null}},{"bidder_id":30,"auction_id":6,"amount":799,"created_at":"2016-01-12T00:25:39+00:00","updated_at":"2016-01-12T00:25:39+00:00","id":73,"bidder":{"github_id":"387035","duns_number":"080033077","name":"Christian G. Warden","sam_account":true,"created_at":"2015-12-29T16:14:47+00:00","updated_at":"2016-01-11T03:15:25+00:00","id":30,"github_login":null}},{"bidder_id":52,"auction_id":6,"amount":800,"created_at":"2016-01-11T22:16:44+00:00","updated_at":"2016-01-11T22:16:44+00:00","id":71,"bidder":{"github_id":"445875","duns_number":"08-011-5718","name":"Joshua Tauberer","sam_account":true,"created_at":"2015-12-30T13:59:52+00:00","updated_at":"2016-01-11T17:52:30+00:00","id":52,"github_login":null}},{"bidder_id":69,"auction_id":6,"amount":1000,"created_at":"2016-01-11T22:15:32+00:00","updated_at":"2016-01-11T22:15:32+00:00","id":70,"bidder":{"github_id":"15251877","duns_number":"079859219","name":"Daniel Connery","sam_account":true,"created_at":"2016-01-05T18:43:53+00:00","updated_at":"2016-01-11T03:15:51+00:00","id":69,"github_login":null}},{"bidder_id":52,"auction_id":6,"amount":1200,"created_at":"2016-01-11T22:14:13+00:00","updated_at":"2016-01-11T22:14:13+00:00","id":68,"bidder":{"github_id":"445875","duns_number":"08-011-5718","name":"Joshua Tauberer","sam_account":true,"created_at":"2015-12-30T13:59:52+00:00","updated_at":"2016-01-11T17:52:30+00:00","id":52,"github_login":null}},{"bidder_id":69,"auction_id":6,"amount":1499,"created_at":"2016-01-11T22:12:16+00:00","updated_at":"2016-01-11T22:12:16+00:00","id":66,"bidder":{"github_id":"15251877","duns_number":"079859219","name":"Daniel Connery","sam_account":true,"created_at":"2016-01-05T18:43:53+00:00","updated_at":"2016-01-11T03:15:51+00:00","id":69,"github_login":null}},{"bidder_id":30,"auction_id":6,"amount":1500,"created_at":"2016-01-11T22:11:18+00:00","updated_at":"2016-01-11T22:11:18+00:00","id":65,"bidder":{"github_id":"387035","duns_number":"080033077","name":"Christian G. Warden","sam_account":true,"created_at":"2015-12-29T16:14:47+00:00","updated_at":"2016-01-11T03:15:25+00:00","id":30,"github_login":null}},{"bidder_id":52,"auction_id":6,"amount":1501,"created_at":"2016-01-11T22:06:11+00:00","updated_at":"2016-01-11T22:06:11+00:00","id":64,"bidder":{"github_id":"445875","duns_number":"08-011-5718","name":"Joshua Tauberer","sam_account":true,"created_at":"2015-12-30T13:59:52+00:00","updated_at":"2016-01-11T17:52:30+00:00","id":52,"github_login":null}},{"bidder_id":30,"auction_id":6,"amount":1998,"created_at":"2016-01-11T22:02:59+00:00","updated_at":"2016-01-11T22:02:59+00:00","id":62,"bidder":{"github_id":"387035","duns_number":"080033077","name":"Christian G. Warden","sam_account":true,"created_at":"2015-12-29T16:14:47+00:00","updated_at":"2016-01-11T03:15:25+00:00","id":30,"github_login":null}},{"bidder_id":69,"auction_id":6,"amount":1999,"created_at":"2016-01-11T21:22:33+00:00","updated_at":"2016-01-11T21:22:33+00:00","id":56,"bidder":{"github_id":"15251877","duns_number":"079859219","name":"Daniel Connery","sam_account":true,"created_at":"2016-01-05T18:43:53+00:00","updated_at":"2016-01-11T03:15:51+00:00","id":69,"github_login":null}},{"bidder_id":52,"auction_id":6,"amount":2000,"created_at":"2016-01-11T18:06:52+00:00","updated_at":"2016-01-11T18:06:52+00:00","id":33,"bidder":{"github_id":"445875","duns_number":"08-011-5718","name":"Joshua Tauberer","sam_account":true,"created_at":"2015-12-30T13:59:52+00:00","updated_at":"2016-01-11T17:52:30+00:00","id":52,"github_login":null}}],"created_at":"2016-01-11T16:44:34+00:00","updated_at":"2016-01-11T16:44:34+00:00","summary":"micropurchase.18f.gov is the site you are using right now to view and bid on micro-purchase opportunities with 18F. This issue seeks to improve the UI by fixing vertical spacing on the auction details page."},{"issue_url":"https://github.com/18F/tock/issues/288","github_repo":"https://github.com/18f/tock","start_price":3500,"start_datetime":"2016-01-11T18:00:00+00:00","end_datetime":"2016-01-12T22:00:00+00:00","title":"Save hours in Tock throughout the week ","description":"## Description\r\n\r\nTock is a simple time tracking app that 18F employees use to report their time on a weekly basis. The application also provides some light data visualization tools that allow users to look at what users have logged time to a project, as well as what projects to which a user has logged time.  This issue seeks to allow users to update their time cards throughout the week.\r\n\r\n## Auction rules \r\n\r\nRegistered users on micropurchase.18f.gov may bid to deliver the requirements in this auction. The lowest bidder at the time the auction closes shall receive the award. The awarded bidder shall have five business days after notice of award to deliver the requirements. Upon successful completion of the requirements, 18F shall pay the winning bidder.\r\n\r\n## Application-specific acceptance criteria\r\n\r\n- A user may save a partially completed time sheet.\r\n- The user has the option to save a time card without submitting (e.g. via a “save time card” button).\r\n- The user has the option to submit a time card (e.g. through the existing “submit time card” button).\r\n- Time cards should have a status flag (e.g. a column added to the hours table/model) which indicates the following states:\r\n-     time card has not been submitted\r\n-     time card has been submitted\r\n- The API endpoints that publish time card data exclude time cards that have not been submitted.\r\n- Other parts of the application that rely on time card data only reference submitted time card data.\r\n- Create a new API endpoint for time cards that have not been submitted.\r\n\r\n## General acceptance criteria\r\n\r\n- B or better code climate grade and 90% or higher test coverage for all modifications.\r\n- Tests adequately cover any new functionality.\r\n- Tests run on Travis-CI and do not break the build.\r\n- New features do not degrade accessibility (use pa11y/HTML Code Sniffer).\r\n\r\n## Resources\r\n\r\nInstructions for installing Tock locally and loading sample data: https://github.com/18F/tock/blob/master/README.md#getting-started\r\n\r\n## Deliverables\r\n\r\nA single pull request submitted to https://github.com/18F/tock with clear, descriptive commits that satisfy all of the above acceptance criteria.\r\n","id":4,"bids":[{"bidder_id":69,"auction_id":4,"amount":374,"created_at":"2016-01-11T21:32:49+00:00","updated_at":"2016-01-11T21:32:49+00:00","id":60,"bidder":{"github_id":"15251877","duns_number":"079859219","name":"Daniel Connery","sam_account":true,"created_at":"2016-01-05T18:43:53+00:00","updated_at":"2016-01-11T03:15:51+00:00","id":69,"github_login":null}},{"bidder_id":52,"auction_id":4,"amount":375,"created_at":"2016-01-11T18:56:01+00:00","updated_at":"2016-01-11T18:56:01+00:00","id":48,"bidder":{"github_id":"445875","duns_number":"08-011-5718","name":"Joshua Tauberer","sam_account":true,"created_at":"2015-12-30T13:59:52+00:00","updated_at":"2016-01-11T17:52:30+00:00","id":52,"github_login":null}},{"bidder_id":69,"auction_id":4,"amount":400,"created_at":"2016-01-11T18:52:34+00:00","updated_at":"2016-01-11T18:52:34+00:00","id":47,"bidder":{"github_id":"15251877","duns_number":"079859219","name":"Daniel Connery","sam_account":true,"created_at":"2016-01-05T18:43:53+00:00","updated_at":"2016-01-11T03:15:51+00:00","id":69,"github_login":null}},{"bidder_id":34,"auction_id":4,"amount":2248,"created_at":"2016-01-11T18:42:47+00:00","updated_at":"2016-01-11T18:42:47+00:00","id":44,"bidder":{"github_id":"6887045","duns_number":"078327018","name":null,"sam_account":true,"created_at":"2015-12-29T17:29:09+00:00","updated_at":"2016-01-11T00:44:39+00:00","id":34,"github_login":null}},{"bidder_id":60,"auction_id":4,"amount":2500,"created_at":"2016-01-11T18:26:42+00:00","updated_at":"2016-01-11T18:26:42+00:00","id":43,"bidder":{"github_id":"319471","duns_number":"148361251","name":"Geoff Harcourt","sam_account":true,"created_at":"2016-01-04T13:35:21+00:00","updated_at":"2016-01-11T03:15:47+00:00","id":60,"github_login":null}},{"bidder_id":34,"auction_id":4,"amount":2775,"created_at":"2016-01-11T18:12:52+00:00","updated_at":"2016-01-11T18:12:52+00:00","id":42,"bidder":{"github_id":"6887045","duns_number":"078327018","name":null,"sam_account":true,"created_at":"2015-12-29T17:29:09+00:00","updated_at":"2016-01-11T00:44:39+00:00","id":34,"github_login":null}},{"bidder_id":69,"auction_id":4,"amount":3049,"created_at":"2016-01-11T18:09:42+00:00","updated_at":"2016-01-11T18:09:42+00:00","id":37,"bidder":{"github_id":"15251877","duns_number":"079859219","name":"Daniel Connery","sam_account":true,"created_at":"2016-01-05T18:43:53+00:00","updated_at":"2016-01-11T03:15:51+00:00","id":69,"github_login":null}},{"bidder_id":34,"auction_id":4,"amount":3050,"created_at":"2016-01-11T18:04:44+00:00","updated_at":"2016-01-11T18:04:44+00:00","id":32,"bidder":{"github_id":"6887045","duns_number":"078327018","name":null,"sam_account":true,"created_at":"2015-12-29T17:29:09+00:00","updated_at":"2016-01-11T00:44:39+00:00","id":34,"github_login":null}}],"created_at":"2016-01-11T16:28:02+00:00","updated_at":"2016-01-11T16:28:02+00:00","summary":"Tock is a simple time tracking app that 18F employees use to report their time on a weekly basis. The application also provides some light data visualization tools that allow users to look at what users have logged time to a project, as well as what projects to which a user has logged time.  This issue seeks to allow users to update their time cards throughout the week."},{"issue_url":"https://github.com/18F/tock/issues/287","github_repo":"https://github.com/18f/tock","start_price":3500,"start_datetime":"2016-01-11T18:00:00+00:00","end_datetime":"2016-01-12T22:00:00+00:00","title":"Tock superusers should be able to enter 0-60 hour weeks","description":"## Description\r\n\r\nTock is a simple time tracking app that 18F employees use to report their time on a weekly \r\nbasis. Currently, no user may enter more than 40 hours per week. This issue seeks to allow certain specified users of Tock to enter anywhere between 0 and 60 hours.\r\n\r\n## Auction rules \r\n\r\nRegistered users on micropurchase.18f.gov may bid to deliver the requirements in this auction. The lowest bidder at the time the auction closes shall receive the award. The awarded bidder shall have five business days after notice of award to deliver the requirements. Upon successful completion of the requirements, 18F shall pay the winning bidder.\r\n\r\n## Application-specific acceptance criteria\r\n\r\nA superuser can view in the admin panel a time card for any other user and select an option (e.g. check a box) which would allow any superuser to enter anywhere between 0 and 60 hours for a given week.\r\nA superuser, when creating or editing a reporting period in the admin panel, can select users who may enter between 0 and 60 hours for that reporting period.\r\n\r\n## General acceptance criteria\r\n\r\nB or better code climate grade and 90% or higher test coverage for all modifications.\r\nTests adequately cover any new functionality.\r\nTests run on Travis-CI and do not break the build.\r\nNew features do not degrade accessibility (use pa11y/HTML Code Sniffer).\r\n\r\n## Resources\r\n\r\nInstructions for installing Tock locally and loading sample data: https://github.com/18F/tock/blob/master/README.md#getting-started\r\n\r\n## Deliverables\r\n\r\nA single pull request submitted to https://github.com/18F/tock with clear, descriptive commits that satisfy all of the above acceptance criteria.","id":5,"bids":[{"bidder_id":69,"auction_id":5,"amount":249,"created_at":"2016-01-12T14:46:27+00:00","updated_at":"2016-01-12T14:46:27+00:00","id":79,"bidder":{"github_id":"15251877","duns_number":"079859219","name":"Daniel Connery","sam_account":true,"created_at":"2016-01-05T18:43:53+00:00","updated_at":"2016-01-11T03:15:51+00:00","id":69,"github_login":null}},{"bidder_id":52,"auction_id":5,"amount":250,"created_at":"2016-01-12T13:13:13+00:00","updated_at":"2016-01-12T13:13:13+00:00","id":75,"bidder":{"github_id":"445875","duns_number":"08-011-5718","name":"Joshua Tauberer","sam_account":true,"created_at":"2015-12-30T13:59:52+00:00","updated_at":"2016-01-11T17:52:30+00:00","id":52,"github_login":null}},{"bidder_id":69,"auction_id":5,"amount":399,"created_at":"2016-01-11T21:32:20+00:00","updated_at":"2016-01-11T21:32:20+00:00","id":59,"bidder":{"github_id":"15251877","duns_number":"079859219","name":"Daniel Connery","sam_account":true,"created_at":"2016-01-05T18:43:53+00:00","updated_at":"2016-01-11T03:15:51+00:00","id":69,"github_login":null}},{"bidder_id":52,"auction_id":5,"amount":400,"created_at":"2016-01-11T19:13:18+00:00","updated_at":"2016-01-11T19:13:18+00:00","id":54,"bidder":{"github_id":"445875","duns_number":"08-011-5718","name":"Joshua Tauberer","sam_account":true,"created_at":"2015-12-30T13:59:52+00:00","updated_at":"2016-01-11T17:52:30+00:00","id":52,"github_login":null}},{"bidder_id":69,"auction_id":5,"amount":500,"created_at":"2016-01-11T19:07:17+00:00","updated_at":"2016-01-11T19:07:17+00:00","id":53,"bidder":{"github_id":"15251877","duns_number":"079859219","name":"Daniel Connery","sam_account":true,"created_at":"2016-01-05T18:43:53+00:00","updated_at":"2016-01-11T03:15:51+00:00","id":69,"github_login":null}},{"bidder_id":60,"auction_id":5,"amount":1775,"created_at":"2016-01-11T18:57:47+00:00","updated_at":"2016-01-11T18:57:47+00:00","id":52,"bidder":{"github_id":"319471","duns_number":"148361251","name":"Geoff Harcourt","sam_account":true,"created_at":"2016-01-04T13:35:21+00:00","updated_at":"2016-01-11T03:15:47+00:00","id":60,"github_login":null}},{"bidder_id":52,"auction_id":5,"amount":1998,"created_at":"2016-01-11T18:57:11+00:00","updated_at":"2016-01-11T18:57:11+00:00","id":51,"bidder":{"github_id":"445875","duns_number":"08-011-5718","name":"Joshua Tauberer","sam_account":true,"created_at":"2015-12-30T13:59:52+00:00","updated_at":"2016-01-11T17:52:30+00:00","id":52,"github_login":null}},{"bidder_id":69,"auction_id":5,"amount":1999,"created_at":"2016-01-11T18:10:59+00:00","updated_at":"2016-01-11T18:10:59+00:00","id":40,"bidder":{"github_id":"15251877","duns_number":"079859219","name":"Daniel Connery","sam_account":true,"created_at":"2016-01-05T18:43:53+00:00","updated_at":"2016-01-11T03:15:51+00:00","id":69,"github_login":null}},{"bidder_id":52,"auction_id":5,"amount":2000,"created_at":"2016-01-11T18:08:48+00:00","updated_at":"2016-01-11T18:08:48+00:00","id":36,"bidder":{"github_id":"445875","duns_number":"08-011-5718","name":"Joshua Tauberer","sam_account":true,"created_at":"2015-12-30T13:59:52+00:00","updated_at":"2016-01-11T17:52:30+00:00","id":52,"github_login":null}}],"created_at":"2016-01-11T16:29:43+00:00","updated_at":"2016-01-11T16:29:43+00:00","summary":"Tock is a simple time tracking app that 18F employees use to report their time on a weekly \r\nbasis. Currently, no user may enter more than 40 hours per week. This issue seeks to allow certain specified users of Tock to enter anywhere between 0 and 60 hours."},{"issue_url":"https://github.com/18F/tock/issues/289","github_repo":"https://github.com/18f/tock","start_price":3500,"start_datetime":"2016-01-11T18:00:00+00:00","end_datetime":"2016-01-12T22:00:00+00:00","title":"Fix data visualization in Tock user interface","description":"## Description\r\n\r\nTock is a simple time tracking app that 18F employees use to report their time on a weekly basis. The application also provides some light data visualization tools that allow users to look at what users have logged time to a project, as well as what projects to which a user has logged time. This issue seeks to fix the current visualization layout, which has become [unreadable](https://github.com/18F/tock/blob/master/tock/tock/static/img/project_mess.jpg), by limiting the number of reporting periods that are displayed to the most-recent five time periods.\r\n\r\n## Auction rules \r\n\r\nRegistered users on micropurchase.18f.gov may bid to deliver the requirements in this auction. The lowest bidder at the time the auction closes shall receive the award. The awarded bidder shall have five business days after notice of award to deliver the requirements. Upon successful completion of the requirements, 18F shall pay the winning bidder.\r\n\r\n## Application-specific acceptance criteria\r\n\r\n- Limit the number of time periods displayed in the table in the project detail page (`/projects/:id`) to the most-recent five time periods.\r\n\r\n## General acceptance criteria\r\n\r\n- B or better code climate grade and 90% or higher test coverage for all modifications.\r\n- Tests adequately cover any new functionality.\r\n- Tests run on Travis-CI and do not break the build.\r\n- New features do not degrade accessibility (use pa11y/HTML Code Sniffer).\r\n\r\n## Resources\r\n\r\nInstructions for installing Tock locally and loading sample data: https://github.com/18F/tock/blob/master/README.md#getting-started\r\n\r\n## Deliverables\r\n\r\nA single pull request submitted to https://github.com/18F/tock with clear, descriptive commits that satisfy all of the above acceptance criteria.\r\n","id":3,"bids":[{"bidder_id":36,"auction_id":3,"amount":347,"created_at":"2016-01-12T21:59:03+00:00","updated_at":"2016-01-12T21:59:03+00:00","id":87,"bidder":{"github_id":"1060893","duns_number":"080037478","name":"brendan sudol","sam_account":true,"created_at":"2015-12-29T17:39:36+00:00","updated_at":"2016-01-11T00:44:39+00:00","id":36,"github_login":null}},{"bidder_id":52,"auction_id":3,"amount":401,"created_at":"2016-01-12T20:02:55+00:00","updated_at":"2016-01-12T20:02:55+00:00","id":84,"bidder":{"github_id":"445875","duns_number":"08-011-5718","name":"Joshua Tauberer","sam_account":true,"created_at":"2015-12-30T13:59:52+00:00","updated_at":"2016-01-11T17:52:30+00:00","id":52,"github_login":null}},{"bidder_id":69,"auction_id":3,"amount":474,"created_at":"2016-01-11T21:32:01+00:00","updated_at":"2016-01-11T21:32:01+00:00","id":58,"bidder":{"github_id":"15251877","duns_number":"079859219","name":"Daniel Connery","sam_account":true,"created_at":"2016-01-05T18:43:53+00:00","updated_at":"2016-01-11T03:15:51+00:00","id":69,"github_login":null}},{"bidder_id":52,"auction_id":3,"amount":475,"created_at":"2016-01-11T18:56:17+00:00","updated_at":"2016-01-11T18:56:17+00:00","id":49,"bidder":{"github_id":"445875","duns_number":"08-011-5718","name":"Joshua Tauberer","sam_account":true,"created_at":"2015-12-30T13:59:52+00:00","updated_at":"2016-01-11T17:52:30+00:00","id":52,"github_login":null}},{"bidder_id":36,"auction_id":3,"amount":499,"created_at":"2016-01-11T18:47:19+00:00","updated_at":"2016-01-11T18:47:19+00:00","id":45,"bidder":{"github_id":"1060893","duns_number":"080037478","name":"brendan sudol","sam_account":true,"created_at":"2015-12-29T17:39:36+00:00","updated_at":"2016-01-11T00:44:39+00:00","id":36,"github_login":null}},{"bidder_id":69,"auction_id":3,"amount":999,"created_at":"2016-01-11T18:10:23+00:00","updated_at":"2016-01-11T18:10:23+00:00","id":39,"bidder":{"github_id":"15251877","duns_number":"079859219","name":"Daniel Connery","sam_account":true,"created_at":"2016-01-05T18:43:53+00:00","updated_at":"2016-01-11T03:15:51+00:00","id":69,"github_login":null}},{"bidder_id":52,"auction_id":3,"amount":1000,"created_at":"2016-01-11T18:09:51+00:00","updated_at":"2016-01-11T18:09:51+00:00","id":38,"bidder":{"github_id":"445875","duns_number":"08-011-5718","name":"Joshua Tauberer","sam_account":true,"created_at":"2015-12-30T13:59:52+00:00","updated_at":"2016-01-11T17:52:30+00:00","id":52,"github_login":null}}],"created_at":"2016-01-11T16:21:23+00:00","updated_at":"2016-01-11T16:21:23+00:00","summary":"Tock is a simple time tracking app that 18F employees use to report their time on a weekly basis. The application also provides some light data visualization tools that allow users to look at what users have logged time to a project, as well as what projects to which a user has logged time. This issue seeks to fix the current visualization layout, which has become [unreadable](https://github.com/18F/tock/blob/master/tock/tock/static/img/project_mess.jpg), by limiting the number of reporting periods that are displayed to the most-recent five time periods."},{"issue_url":"https://github.com/18F/micropurchase/issues/217","github_repo":"https://github.com/18F/micropurchase/","start_price":3500,"start_datetime":"2016-01-11T18:00:00+00:00","end_datetime":"2016-01-12T22:00:00+00:00","title":"Display upcoming auction start time in micro-purchase","description":"## Description \r\n\r\nmicropurchase.18f.gov is the site you are using right now to view and bid on micro-purchase opportunities with 18F. This issue seeks to improve the UI by displaying the auction start time on several pages of the site.\r\n\r\n## Auction rules \r\n\r\nRegistered users on micropurchase.18f.gov may bid to deliver the requirements in this auction. The lowest bidder at the time the auction closes shall receive the award. The awarded bidder shall have five business days after notice of award to deliver the requirements. Upon successful completion of the requirements, 18F shall pay the winning bidder.\r\n\r\n## Application-specific acceptance criteria\r\n\r\n- In the auctions#index view, the auction start time is displayed next to the auction end time\r\n- In the auctions#show view, the auction start time is displayed next to the auction end time in the bid info box.\r\n\r\n## General acceptance criteria \r\n\r\n- B or better code climate grade and 90% or higher test coverage for all modifications.\r\n- Tests adequately cover any new functionality.\r\n- Tests run on Travis-CI and do not break the build.\r\n- New features do not degrade accessibility (use pa11y/HTML Code Sniffer).\r\n\r\n## Resources\r\n\r\n- https://github.com/18F/micropurchase/issues/217\r\n\r\n## Deliverables\r\n\r\nA single pull request submitted to https://github.com/18F/micropurchase with clear, descriptive commits that satisfy all of the above acceptance criteria.","id":7,"bids":[{"bidder_id":49,"auction_id":7,"amount":399,"created_at":"2016-01-12T21:59:14+00:00","updated_at":"2016-01-12T21:59:14+00:00","id":88,"bidder":{"github_id":"688980","duns_number":"313210696","name":"Mila Frerichs","sam_account":true,"created_at":"2015-12-30T06:05:37+00:00","updated_at":"2016-01-11T03:15:33+00:00","id":49,"github_login":null}},{"bidder_id":30,"auction_id":7,"amount":400,"created_at":"2016-01-12T21:46:36+00:00","updated_at":"2016-01-12T21:46:36+00:00","id":85,"bidder":{"github_id":"387035","duns_number":"080033077","name":"Christian G. Warden","sam_account":true,"created_at":"2015-12-29T16:14:47+00:00","updated_at":"2016-01-11T03:15:25+00:00","id":30,"github_login":null}},{"bidder_id":52,"auction_id":7,"amount":401,"created_at":"2016-01-12T19:58:19+00:00","updated_at":"2016-01-12T19:58:19+00:00","id":82,"bidder":{"github_id":"445875","duns_number":"08-011-5718","name":"Joshua Tauberer","sam_account":true,"created_at":"2015-12-30T13:59:52+00:00","updated_at":"2016-01-11T17:52:30+00:00","id":52,"github_login":null}},{"bidder_id":30,"auction_id":7,"amount":495,"created_at":"2016-01-12T15:44:44+00:00","updated_at":"2016-01-12T15:44:44+00:00","id":81,"bidder":{"github_id":"387035","duns_number":"080033077","name":"Christian G. Warden","sam_account":true,"created_at":"2015-12-29T16:14:47+00:00","updated_at":"2016-01-11T03:15:25+00:00","id":30,"github_login":null}},{"bidder_id":69,"auction_id":7,"amount":500,"created_at":"2016-01-12T14:45:47+00:00","updated_at":"2016-01-12T14:45:47+00:00","id":78,"bidder":{"github_id":"15251877","duns_number":"079859219","name":"Daniel Connery","sam_account":true,"created_at":"2016-01-05T18:43:53+00:00","updated_at":"2016-01-11T03:15:51+00:00","id":69,"github_login":null}},{"bidder_id":52,"auction_id":7,"amount":501,"created_at":"2016-01-12T13:13:33+00:00","updated_at":"2016-01-12T13:13:33+00:00","id":76,"bidder":{"github_id":"445875","duns_number":"08-011-5718","name":"Joshua Tauberer","sam_account":true,"created_at":"2015-12-30T13:59:52+00:00","updated_at":"2016-01-11T17:52:30+00:00","id":52,"github_login":null}},{"bidder_id":30,"auction_id":7,"amount":600,"created_at":"2016-01-12T00:25:25+00:00","updated_at":"2016-01-12T00:25:25+00:00","id":72,"bidder":{"github_id":"387035","duns_number":"080033077","name":"Christian G. Warden","sam_account":true,"created_at":"2015-12-29T16:14:47+00:00","updated_at":"2016-01-11T03:15:25+00:00","id":30,"github_login":null}},{"bidder_id":52,"auction_id":7,"amount":602,"created_at":"2016-01-11T22:15:14+00:00","updated_at":"2016-01-11T22:15:14+00:00","id":69,"bidder":{"github_id":"445875","duns_number":"08-011-5718","name":"Joshua Tauberer","sam_account":true,"created_at":"2015-12-30T13:59:52+00:00","updated_at":"2016-01-11T17:52:30+00:00","id":52,"github_login":null}},{"bidder_id":69,"auction_id":7,"amount":684,"created_at":"2016-01-11T22:13:04+00:00","updated_at":"2016-01-11T22:13:04+00:00","id":67,"bidder":{"github_id":"15251877","duns_number":"079859219","name":"Daniel Connery","sam_account":true,"created_at":"2016-01-05T18:43:53+00:00","updated_at":"2016-01-11T03:15:51+00:00","id":69,"github_login":null}},{"bidder_id":30,"auction_id":7,"amount":685,"created_at":"2016-01-11T22:04:54+00:00","updated_at":"2016-01-11T22:04:54+00:00","id":63,"bidder":{"github_id":"387035","duns_number":"080033077","name":"Christian G. Warden","sam_account":true,"created_at":"2015-12-29T16:14:47+00:00","updated_at":"2016-01-11T03:15:25+00:00","id":30,"github_login":null}},{"bidder_id":49,"auction_id":7,"amount":698,"created_at":"2016-01-11T21:59:45+00:00","updated_at":"2016-01-11T21:59:45+00:00","id":61,"bidder":{"github_id":"688980","duns_number":"313210696","name":"Mila Frerichs","sam_account":true,"created_at":"2015-12-30T06:05:37+00:00","updated_at":"2016-01-11T03:15:33+00:00","id":49,"github_login":null}},{"bidder_id":69,"auction_id":7,"amount":699,"created_at":"2016-01-11T21:30:49+00:00","updated_at":"2016-01-11T21:30:49+00:00","id":57,"bidder":{"github_id":"15251877","duns_number":"079859219","name":"Daniel Connery","sam_account":true,"created_at":"2016-01-05T18:43:53+00:00","updated_at":"2016-01-11T03:15:51+00:00","id":69,"github_login":null}},{"bidder_id":60,"auction_id":7,"amount":700,"created_at":"2016-01-11T19:59:30+00:00","updated_at":"2016-01-11T19:59:30+00:00","id":55,"bidder":{"github_id":"319471","duns_number":"148361251","name":"Geoff Harcourt","sam_account":true,"created_at":"2016-01-04T13:35:21+00:00","updated_at":"2016-01-11T03:15:47+00:00","id":60,"github_login":null}},{"bidder_id":52,"auction_id":7,"amount":701,"created_at":"2016-01-11T18:56:57+00:00","updated_at":"2016-01-11T18:56:57+00:00","id":50,"bidder":{"github_id":"445875","duns_number":"08-011-5718","name":"Joshua Tauberer","sam_account":true,"created_at":"2015-12-30T13:59:52+00:00","updated_at":"2016-01-11T17:52:30+00:00","id":52,"github_login":null}},{"bidder_id":36,"auction_id":7,"amount":799,"created_at":"2016-01-11T18:49:33+00:00","updated_at":"2016-01-11T18:49:33+00:00","id":46,"bidder":{"github_id":"1060893","duns_number":"080037478","name":"brendan sudol","sam_account":true,"created_at":"2015-12-29T17:39:36+00:00","updated_at":"2016-01-11T00:44:39+00:00","id":36,"github_login":null}},{"bidder_id":69,"auction_id":7,"amount":1499,"created_at":"2016-01-11T18:11:58+00:00","updated_at":"2016-01-11T18:11:58+00:00","id":41,"bidder":{"github_id":"15251877","duns_number":"079859219","name":"Daniel Connery","sam_account":true,"created_at":"2016-01-05T18:43:53+00:00","updated_at":"2016-01-11T03:15:51+00:00","id":69,"github_login":null}},{"bidder_id":52,"auction_id":7,"amount":1500,"created_at":"2016-01-11T18:08:23+00:00","updated_at":"2016-01-11T18:08:23+00:00","id":35,"bidder":{"github_id":"445875","duns_number":"08-011-5718","name":"Joshua Tauberer","sam_account":true,"created_at":"2015-12-30T13:59:52+00:00","updated_at":"2016-01-11T17:52:30+00:00","id":52,"github_login":null}},{"bidder_id":49,"auction_id":7,"amount":2000,"created_at":"2016-01-11T18:03:50+00:00","updated_at":"2016-01-11T18:03:50+00:00","id":31,"bidder":{"github_id":"688980","duns_number":"313210696","name":"Mila Frerichs","sam_account":true,"created_at":"2015-12-30T06:05:37+00:00","updated_at":"2016-01-11T03:15:33+00:00","id":49,"github_login":null}}],"created_at":"2016-01-11T17:08:53+00:00","updated_at":"2016-01-11T17:08:53+00:00","summary":"micropurchase.18f.gov is the site you are using right now to view and bid on micro-purchase opportunities with 18F. This issue seeks to improve the UI by displaying the auction start time on several pages of the site."}]};

    var settings = setChartSettings(data);
    runVisualizations(data, settings);
    setWaypoints(settings)
  })
  .error(function(error){
    throw "Error retrieving auction data";
  })

});

