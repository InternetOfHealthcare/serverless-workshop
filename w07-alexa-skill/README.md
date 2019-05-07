# Example 07 - Alexa Skill for Glucose Database

Now let's have some fun doing an Alexa Skill to interact with your glucose data.

### 1. Go to developer.amazon.com 

![image](images/01.png) 

### 2. Click Login, create a new login if you don't have Amazon Developer account. This account is different from AWS account!

![image](images/02.1.png) 

### 3. Click "Your Alexa Consoles", "Skills"

![image](images/03.png) 

### 4. Click "Create Skill"

![image](images/04.png) 

### 5. Name your skill and choose the language 

![image](images/05.png) 

### 6. Now we are ready to start the skill development!

![image](images/06.png) 

### 7. Let's configure the Invocation Name and click "Save Model". This will be used like: "Alexa, abrir Control de Glucosa":

![image](images/07.png)

### 8. Now we need to setup our intents, intents represents a communication between Alexa and the user. Intents have a name and also one or more utterances (phrases, expression). Click "+Add Intent" to setup our first intent.

![image](images/08.png)

### 9. glucose_status this intent is simple (without parameters / slot!) and will bring the average glucose.

![image](images/09.png)

### 10. glucose_status_hour. This intent will has a slot / parameter called "{hour}" and you must setup the slot as AMAZON.NUMBER

![image](images/10.png)

### 11. glucose_add. This intent allows the user to make a new glucose input and it has a slot as well called glucosa that must be configured as AMAZON.NUMBER

![image](images/11.png)
