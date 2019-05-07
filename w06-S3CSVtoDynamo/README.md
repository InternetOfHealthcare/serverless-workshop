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

### 4. Now let's upload our file clicking "Upload" 

![image](images/03.png) 

### 5. Click "Add Files" 
![image](images/04.png) 

### 6. Select the file /w06-S3CSVtoDynamo/CSV/glucose.csv

![image](images/05.png) 

### 7. Click next

![image](images/06.png) 

### 8. Click upload
![image](images/07.png) 

### 9. You should have this screen as a result:

![image](images/08.png) 

### 10. Now let's setup some parameters in our project, open serverless.yml and change the name to the correct bucket, file name and DynamoDB table:

![image](images/091.png) 

### 11. Inspect [the code](handler.js) and then deploy it:

* cd w06-S3CSVtoDynamo
* serverless deploy

### 12. Let's run the code to import the data:

![image](images/10.png) 


