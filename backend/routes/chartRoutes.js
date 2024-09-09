import express from 'express';
import Order from '../models/orderModel.js';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import Workshop from '../models/workshopModel.js';

const chartRouter = express.Router();

chartRouter.get('/sales-data', async (req, res) => {
  try {
    const sales = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, // Group by day
          totalSales: { $sum: '$totalPrice' },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    console.log('sales', sales);
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get total users
chartRouter.get('/user-data', async (req, res) => {
  try {
    const users = await User.find({});
    res.json({ count: users.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get workshop registrations per month
chartRouter.get('/workshop-data', async (req, res) => {
  try {
    const workshops = await Workshop.find({});
    // console.log("All Workshops:", workshops);

    const registrations = await Workshop.aggregate([
      {
        $unwind: '$registeredUsers',
      },
      {
        $group: {
          _id: { $month: '$date' },
          totalRegistrations: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    console.log('Registrations:', registrations);

    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

chartRouter.get('/productPerformance', async (req, res) => {
  try {
    const users = await User.find({});
    const productPerformanceData = users.flatMap((user) =>
      user?.products?.map((product) => ({
        productName: product.name,
        sales: product.quantity, // Assuming 'quantity' tracks the number of times sold
      }))
    );
    res.json({ data: productPerformanceData });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error fetching product performance data' });
  }
});

chartRouter.get('/revenue', async (req, res) => {
  try {
    const orders = await Order.find({});
    const revenueData = orders.map((order) => order.totalPrice);
    res.json({ data: revenueData });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching revenue data' });
  }
});

chartRouter.get('/userGrowth', async (req, res) => {
  try {
    const users = await User.find({}, 'createdAt'); // Fetch only the createdAt field
    // console.log('Fetched Users:', users); // Log fetched users

    const userGrowthData = {};

    users.forEach((user) => {
      const month = new Date(user.createdAt).getMonth() + 1; // Get the month (1-12)
      userGrowthData[month] = (userGrowthData[month] || 0) + 1;
    });

    // console.log('User Growth Data:', userGrowthData); // Log the growth data

    const formattedData = Object.keys(userGrowthData).map((month) => ({
      month: `Month ${month}`,
      users: userGrowthData[month],
    }));

    res.json({ data: formattedData });
  } catch (error) {
    console.error('Error fetching user growth data:', error); // Detailed error logging
    res.status(500).json({ message: 'Error fetching user growth data' });
  }
});

chartRouter.get('/user-demographics', async (req, res) => {
  try {
    const demographics = await User.aggregate([
      {
        $facet: {
          ageGroups: [
            {
              $bucket: {
                groupBy: '$age', // Adjust this based on the field used for age
                boundaries: [0, 18, 25, 35, 45, 60, 100],
                default: 'Other',
                output: {
                  count: { $sum: 1 },
                },
              },
            },
          ],
          genderDistribution: [
            {
              $group: {
                _id: '$gender', // Adjust this based on the field used for gender
                count: { $sum: 1 },
              },
            },
          ],
          locationDistribution: [
            {
              $group: {
                _id: '$location', // Adjust this based on the field used for location
                count: { $sum: 1 },
              },
            },
          ],
        },
      },
    ]);

    res.json(demographics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

  chartRouter.get('/customer-retention', async (req, res) => {
    try {
      const retentionData = await Order.aggregate([
        {
          $group: {
            _id: { $month: '$createdAt' },
            totalCustomers: { $addToSet: '$user' }, // Collect unique customer IDs
          },
        },
        {
          $project: {
            _id: 1,
            totalCustomers: { $size: '$totalCustomers' }, // Count unique customers
          },
        },
        {
          $sort: { _id: 1 }, // Sort by month
        },
      ]);
  
      const returningCustomers = await Order.aggregate([
        {
          $group: {
            _id: { $month: '$createdAt' },
            returningCustomers: {
              $addToSet: {
                $cond: [
                  { $gt: [{ $size: '$orderItems' }, 1] }, // Condition to check if customer is returning
                  '$user',
                  null,
                ],
              },
            },
          },
        },
        {
          $project: {
            _id: 1,
            returningCustomers: { $size: '$returningCustomers' }, // Count returning customers
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]);
  
      const retentionRate = retentionData.map((month, index) => ({
        month: month._id,
        totalCustomers: month.totalCustomers,
        returningCustomers: returningCustomers[index]?.returningCustomers || 0,
        retentionRate: (
          (returningCustomers[index]?.returningCustomers || 0) /
          month.totalCustomers
        ).toFixed(2),
      }));
  
      res.json(retentionRate);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  

// chartRouter.get('/order-fulfillment-time', async (req, res) => {
//   try {
//     const fulfillmentTimes = await Order.aggregate([
//       {
//         $match: {
//           isDelivered: true, // Only consider orders that have been delivered
//         },
//       },
//       {
//         $project: {
//           yearMonthDay: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
//           fulfillmentTime: {
//             $divide: [{ $subtract: ["$deliveredAt", "$createdAt"] }, 1000 * 60 * 60 * 24], // Fulfillment time in days
//           },
//         },
//       },
//       {
//         $group: {
//           _id: "$yearMonthDay", // Group by year-month-day
//           avgFulfillmentTime: { $avg: "$fulfillmentTime" }, // Calculate the average fulfillment time
//         },
//       },
//       { $sort: { _id: 1 } }, // Sort by date
//     ]);

//     console.log('frruurll' , fulfillmentTimes)
//     res.json(fulfillmentTimes);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

  // Revenue by Product Category
  // chartRouter.get('/revenue-by-category', async (req, res) => {
  //   try {
  //     const revenueByCategory = await Order.aggregate([
  //       { $unwind: '$orderItems' },
  //       {
  //         $lookup: {
  //           from: 'products',
  //           localField: 'orderItems.product',
  //           foreignField: '_id',
  //           as: 'productDetails'
  //         }
  //       },
  //       { $unwind: '$productDetails' },
  //       {
  //         $group: {
  //           _id: '$productDetails.category',
  //           totalRevenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } }
  //         }
  //       },
  //       { $sort: { totalRevenue: -1 } }
  //     ]);
  
  //     console.log('Revenue by Category:', revenueByCategory); // Log result for debugging
  //     res.json(revenueByCategory);
  //   } catch (error) {
  //     console.error('Error fetching revenue by category:', error); // Log error
  //     res.status(500).json({ message: error.message });
  //   }
  // });

  
  chartRouter.get('/workshopRegistrations', async (req, res) => {
    try {
      const workshops = await Workshop.find().populate('registeredUsers', 'name');

      const data = workshops.map((workshop) => ({
        workshopName: workshop.name,
        registrations: workshop.registeredUsers.length,
      }));

      res.json({ data });
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch workshop registrations' });
    }
  });

  
  chartRouter.get('/workshopCompletions', async (req, res) => {
    try {
      const workshops = await Workshop.find();
      const workshopCompletionData = [];

      for (const workshop of workshops) {
        const userCount = await User.countDocuments({
          'workshops._id': workshop._id,
        });
        workshopCompletionData.push({
          workshopName: workshop.name,
          completions: userCount,
        });
      }

      res.json({ data: workshopCompletionData });
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch workshop completion data' });
    }
  });
  
  

  
  
  

  export default chartRouter;