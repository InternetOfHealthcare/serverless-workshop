# Example 05 - Serverless Database with DynamoDB + API Gateway

Now we are doing the same we did with our translation service but now with DynamoDB.   

### 1. Let's deploy the example:

* cd w05-dynamodb-api
* serverless deploy

![image](images/00.png) 

### 4. Let's run the code to add new records and read the existing ones

* serverless invoke -f dynamodb -l

![image](images/03.png) 

### 5. Go back to DynamoDB console and check if you have new records in your table:

![image](images/04.png) 
