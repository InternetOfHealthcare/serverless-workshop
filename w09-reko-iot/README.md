# Example 09 - Lambda + Rekognition + S3 + IoT

Now we will have a more sophisticated architecture integrating S3, Rekognition and IoT. We will configure our S3 bucket to automatically trigger a Lambda function when a new picture is uploaded. This Lambda function will use Rekognition to count people inside the picture and then will be sending an IoT message (MQTT message) to notify the number of people.

### 1. We can see at our serverless.yml config file that we are attaching our Lambda function to a S3 bucket. Every time we have a new file into the bucket w09-reko-iot this Lambda will be triggered:

![image](images/01.png) 

