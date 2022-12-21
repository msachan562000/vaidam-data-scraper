const puppeteer = require("puppeteer");
const shell = require("shelljs");
async function hospitalDataScraper(hospitalUrl = "https://www.vaidam.com/hospitals/bumrungrad-international-hospital-bangkok") {
    console.log("Started: hospitalDataScraper => ", hospitalUrl);
    const browser = await puppeteer.launch({headless: false, args: ["--no-sandbox"]});
    try {
        const page = await browser.newPage();

        await page.goto(hospitalUrl, {
            waitUntil: "networkidle2",
            timeout: 0
        });
        page.on("console", (message) => console.log(`${
            message.type().toUpperCase()
        } ${
            message.text()
        }`));
        let hospitalData = await page.evaluate(async () => {
            let metaData = document.querySelectorAll(".joint-list span");
            metaData = [... metaData].map((ele) => {
                return ele.innerHTML;
            });
            const established_in = parseInt(metaData[0], 10);
            let beds = document.querySelector(".joint-list li:last-child") ?. innerText ?. trim().split(" ");
            beds = beds ?. [0];

            let facilities = document.querySelectorAll("div.text-body > ul > li");
            facilities = [... facilities].map((item) => {
                return item ?. innerText;
            });
            let payment_methods = facilities;
            let facility_amenities = facilities;
            let facility_comforts = facilities;
            let facility_treatment = facilities;
            let facility_language = facilities;
            let facility_food = facilities;
            let facility_transport = facilities;

            // Payment methods in Clinicspots
            const paymentMethodsArr = [
                "Medical travel insurance",
                "Health insurance coordination",
                "Foreign currency exchange",
                "ATM",
                "Credit Card",
                "Debit Card",
                "Netbanking",
            ];
            const comforts = [
                "Beauty Salon",
                "Business centre services",
                "Café",
                "Dedicated smoking areas",
                "Dry cleaning",
                "Family accommodation",
                "Fitness",
                "Free Wifi",
                "Laundry",
                "Mobility accessible rooms",
                "Nursery / Nanny services",
                "Parking available",
                "Personal assistance / Concierge",
                "Phone in Room",
                "Private rooms",
                "Religious facilities",
                "Safe in the room",
                "Shop",
                "Spa and wellness",
                "Special offer for group stays",
                "TV in room",
                "Welcome",
                "AC",
            ];
            const treatment = [
                "Document legalisation",
                "Medical records transfer",
                "Online doctor consultation",
                "Pharmacy",
                "Post operative followup",
                "Rehabilitation",
                "Bloodbank",
                "Diagnostic Lab Service",
                "Emergency Service",
            ];
            const language = ["Interpreter", "Translation services"];
            const food = ["Diet on Request", "International Cuisine/ Multi Cuisine", "Restaurant"];
            const transport = [
                "Air ambulance",
                "Airport pickup",
                "Car Hire",
                "Local tourism options",
                "Local transportation booking",
                "Private driver / Limousine services",
                "Shopping trip organisation",
                "Visa / Travel office",
            ];
            payment_methods = payment_methods.filter((item) => paymentMethodsArr.includes(item));
            facility_comforts = facility_comforts.filter((item) => comforts.includes(item));
            facility_treatment = facility_treatment.filter((item) => treatment.includes(item));
            facility_language = facility_language.filter((item) => language.includes(item));
            facility_food = facility_food.filter((item) => food.includes(item));
            facility_transport = facility_transport.filter((item) => transport.includes(item));
            facility_amenities = [
                ... facility_comforts,
                ... facility_treatment,
                ... facility_language,
                ... facility_food,
                ... facility_transport,
            ];
            console.log(facility_amenities);


            let city_name = document.querySelector("span.secondary-heading-md") ?. innerText ?. trim();
            if (city_name) {
                city_name = city_name ?. split(",");
                city_name = city_name ?. length > 0 ? city_name[0] : null;
            }
            city_name = city_name === "" ? null : city_name;
            let name = document.querySelector("h1.hospital-detail-main-heading") ?. innerText ?. trim();

            const nameArr = name ?. split(",");
            /* remove city name if present otherwise return same name */
            name = nameArr[1] ?. trim() === city_name ? nameArr[0] ?. trim() : name;
            let address_line = document.querySelector("div#section-address") ?. innerText.split("\n") ?. splice(2) ?. filter((element) => {
                return element.length > 0;
            });
            address_line = address_line ?. [0] || address_line;
            const doctorsPageLink = document.querySelector("a.btn-show-more") ?. href;
            return {
                name,
                beds,
                established_in,
                payment_methods,
                facility_amenities,
                facilities,
                city_name,
                address_line,
                doctorsPageLink,
                doctors: [],
                clinicspotsId: null
            };
        });
        console.log("Task Finished!!! (hospitalDataScraper.js)");
        console.log(hospitalData);
        return hospitalData;
    } catch (err) {
        console.log(err);
    } finally {
        await browser.close();
        shell.exec("taskkill /F /IM chrome.exe"); // force kill chrome or chromium
    }
}
module.exports = hospitalDataScraper;
