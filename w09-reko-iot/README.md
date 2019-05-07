# Example 09 - Lambda + Rekognition + S3 + IoT

Now we will have a more sophisticated architecture integrating S3, Rekognition and IoT. We will configure our S3 bucket to automatically trigger a Lambda function when a new picture is uploaded. This Lambda function will use Rekognition to count people inside the picture and then will be sending an IoT message (MQTT message) to notify the number of people.

### 1. We can see at our serverless.yml config file that we are attaching our Lambda function to a S3 bucket. Every time we have a new file into the bucket w09-reko-iot this Lambda will be triggered:

![image](images/01-ok.png) 

### 2. To send IoT / MQTT message we need to update our handler.js with the right IoT endpoit:

![image](images/02.png) 

### 3. To find your IoT endpoint open IoT Core Console:

![image](images/03.png) 

### 4. Click "Settings" a copy the address and past inside your handler.js function:

![image](images/04.png) 

### 5. Open the IoT Console and Click "Test"

![image](images/05.png) 

### 6. For each picture we upload to our bucket, we should receive a message inside the topic "countPeople", so let's subscribe to this topic:

![image](images/06.png) 

### 7. Now let's deploy the Lambda function:

* cd w09-reko-iot
* serverless deploy

![image](images/07.png) 

### 8. Now it's time to upload a picture to S3 "w09-reko-iot" bucket and wait for the message here:

* PS. don't use spaces in your filename! spaces are special character and may need some special encoding.

![image](images/08.png) 






