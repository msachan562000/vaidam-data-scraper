Steps to scrape data from vaidam's website...

1. Change the url in step1.js,and search for other files having links and provide some default value about the hospital link,doctor link and others in the same way.
2. Run npm i
3. Go from step1.js to step4.js
4. Then run all other files which have names like fetchDoctorSpecializations.js and others.
5. Run workportal server on 8080 port
6. Change the country code in step6.js
7. After running all the files run step5.js and step6.js
8. Correct the errors found in error files in mongodb and then re-run the step5.js and step6.js files after ddeleting the error files.
9. If nothing is saving or the error is like default value for id not set then restart wampp or reinstall database.
10. command to clean clinicspotsId to null using mongo shell "db.doctorData.updateMany({}, {$set: {clinicspotsId: null}})"
