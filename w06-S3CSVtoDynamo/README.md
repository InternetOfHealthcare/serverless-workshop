# Example 06 - S3 storage to DynamoDB

S3 is our famous file storage. This example we will upload a CSV file to your S3 and then run a Lambda function that will read the file and add records to your glucose table.

This CSV is a real file imported from Freestyle Libre:

![image](images/libre-ok.png) 

### 1. Open your S3 console and click "Create bucket". Bucket is a S3 "directory":

![image](images/00.png) 

### 2. Give a name to your bucket:

![image](images/01.png) 

### 3. Click next until you find "Create bucket"

![image](images/02.png) 


