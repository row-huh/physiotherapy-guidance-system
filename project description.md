- doctor registers, as soon as doctor logs in as a new doctor on the platform, they will be provided with a code. that code is unique for each doctor. 
- The doctor can print that code or set it as their profile picture or put a printed copy on desk or whatever
- patient comes in, say maria comes in. she meets the doctor and if she needs exercises that need to be done at home, the doctor will give her the printed paper or whatever which is basically saying that 'go to this site' and 'enter this code'
- maria goes home, she logs in/registers to the system. After logging in, she will be prompted to enter a code from her doctor. she enters the code, then a request gets sent to that doctor: A patient named Maria Whatever has requested to join. 
- the doctor accepts that request and then the patient maria will be shown in the doctor's dashboard
- during the next visits, doctor can use that dashboard to assign exercises to maria. the doctor can :
- a) specify exercise name
- b) get shown default angles for that exercise which can be edited
- b) the doctor can then specify specific angles, say maria shouldn't raise her arm more than 60 degrees, so the doctor will put a limit on x joint and it shouldn't go over 60 degrees
- maria goes home, logs back in to the portal, she will see exercises assigned by the doc. She starts doing the exercise being assisted by a monitoring system which will make sure that she isn't going over 60 degrees and all her other joint angles and postures are correct
- the system will keep track of her information as in how many reps she did
- she can also skip the exercises and be prompted to specify a reason to make sure if something hurts that information is sent to the doctor or maybe something came up - whatever the reason
- the doctor will be shown daily, weekly, monthly or whatever's the required time frame's report with all statistics and if maria is having trouble doing any exercise etc
- the doc can iterate on this while having regular reports of their patients and track improvement

## Schema
- patients -> id, fk doctor_id, progress report, small description about your problem (not necessary, just add it to help out your doc or whatever)
- doctors -> id, name, hospital, code
- notes that a doctor can write some extra information about each patient
- progress
- exercises assigned + details like 60 degrees se upar na jao
- how much time has it been
patients table's doctor id can be null and be assigned later
(brainstorm later)


## Technical Description:
- frontend, backend, pose tracker runs on backend, database could be postgresSQL preferrably supabase coz ik supabase is free to some extent, hosted online and easy to integrate 
A very detailed walkthrough of everything:
- two login types, doctor and patients. 
- Doctor registers himself, gets shown a code card (something that has the website link and the doctor's unique code). After you close the intial window, there's still some other way you can access that code again, somewhere in the settings
- the doctor can also have a profile setting, somewhere where they can update where they work at, the hospitals they're a part of (could be multiple), a small bio, a profile picture, phone number, email and stuff
- the doctor will get shown a screen that just says ' invite your patients to see a dashboard'
- the doctor then prints that code, puts it as his pfp or whatever and he can now start inviting his patients

User's POV:
- doctor asked to use this stupid app, opens it
- signs in/registers/whatever
- gets shown a profile editing menu, some other small things (to be figured out later) and the main dashboard will have text saying 'enter your doctor's code to get shown what exercises to do' or somethign similar
- as soon as the patient enters the doctor code providedd by the doctor himself, they will see a 'request sent - your doctor will be seeing this soon'. 

Doctor's POV:
- sees a notification that a new patient is trying to enter. the doctor gets to accept/reject based on whether the patient is a real patient or if some prankster just hopped in (small attempt at helping doctor avoid spam)
- in the next visit or whenever, the doctor can then assign exercises to that patient or any other patient.
- The doctor can also specify some angles that should be avoided for that certain person
- the doctor will then provide frequency : reps, how many times a day, till how many days etc

User's POV:
- user gets a notification that says 'your doctor has assigned x exercises that need to be done weekly'
- the system auto plans the schedule, weekly means the date assigned is the start date
- and auto-assigns everything related to it
- everyday when the user logs in they'll see a notification that shows them today's agenda like you have to do 30 squats 3 sets or stuff
- they perform the exercises and the system will automatically start checking them like 'x finished' 
-  all the metrics will be recorded and stored in database
- then all that info will be summarized and shown in doctor's dashboard

thats about it