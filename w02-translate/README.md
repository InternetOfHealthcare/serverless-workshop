# Example 02 - Creating your own translator based on Amazon Translate

Now let's go straight to the functionality by creating our own translator but... Before we go ahead let's do AWS Lambdas in a much better way: using the Serverless open-source framework!

PS. If you didn't follow the setup instructions to install Serverless Framework, here is the link: 

Serverless Framework allows you to write Lambda code in your computer and then deploy it to AWS Cloud like a boss. All the Lambda configuration are defined in the file serverless.yml:



Let's start using by download all the workshop examples here: https://github.com/InternetOfHealthcare/serverless-workshop/archive/master.zip

![image](images/00.png) 

Unzip this file and then you will see one directory for each example, let's jump into the number two by typing the following commands inside the workshop's zip directory:

* cd w02-translate
* serverless deploy


### 1. Type "serverless deploy" to deploy your local code to AWS Cloud

![image](images/01.png) 

### 2. To test your Lambda function (not in your computer!), just type "serverless invoke -f translate -l"

![image](images/02.png) 

### 3. Now you can try to change and play with this code!	
