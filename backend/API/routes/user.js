/** @format */

const express = require("express");
// router.use(express.urlencoded({ extended: true }));

const dynamoDbService = require("../service/dynamoDBService");

const router = express.Router();

router.get("/profile", async (request, response) => {
  const userId = request.query?.userId;
  const params = {
    TableName: "users-table",
    Key: {
      userId: `USER_ID#${userId}#PARTITION_TYPE#profile`,
    },
  };

  const profile = await dynamoDbService.getItem(params);
  if (profile?.aadhaarNumber) {
    profile.aadhaarNumber =
      "********" + profile.aadhaarNumber.toString().substr(8);
  }
  // response.status(200).json({ ...profile });
  // response.send(path.join(__dirname, "/index.html"));
  response.send(profile);

  // res.sendFile(path.join(__dirname, "/index.html"));
});

router.post("/itr", async (request, response) => {
  const body = JSON.parse(Object.keys(request.body)[0]);

  console.log("request body ==>", body);

  try {
    if (body.userId) {
      const params = {
        TableName: "users-table",
        Item: {
          userId: `USER_ID#${body.userId}#PARTITION_TYPE#itr`,
          incomeSourceDetails: {
            grossSalary: body.grossSalary,
            exemptAllowance: body.exemptAllowance,
            claimedReliefIncome: body.claimedReliefIncome,
            netSalary: body.netSalary,
            deductions: body.deductions,
            grossTotalSalary: body.grossTotalSalary,
          },
          deductionDetails: {
            grossTotalSalary: body.grossTotalSalary,
            totalDeductions: body.totalDeductions,
          },
          taxPaidDetails: {
            TDSOnSalaryIncome: body.TDSOnSalaryIncome,
            TDSFromOtherIncomes: body.TDSFromOtherIncomes,
            totalTaxPaid: body.totalTaxPaid,
          },
          taxLiabilityDetails: {
            grossTotalIncome: body.grossTotalIncome,
            totalDeductions: body.totalDeductions,
            totalIncome: body.totalIncome,
          },
        },
      };

      console.log("params ==>", JSON.stringify(params));
      await dynamoDbService.putItem(params);
      response.status(200).json({
        message: "Record saved successfully.",
      });
    } else {
      response.status(400).json({
        message: "userId is required",
      });
    }
  } catch (error) {
    response.status(500).json({
      message: "Internal server Error.",
    });
  }
});

module.exports = router;
