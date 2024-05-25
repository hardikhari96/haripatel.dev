/**
 * Resume/CV template created with Bootstrap 5 by @vmoratog and @jdnichollsc
 */
const resume = {
    firstName: "Harikrushna",
    lastName: "Patel",
    jobTitle: "Full Stack Developer",
    city: "Ahmedabad,Gujarat",
    postalCode: "380015",
    country: "India",
    phone: "*****",
    email: "haripatel[at]zoho[dot]com",
    education: [
      {
        school: "ITC,Mogri",
        graduationDate: "2020",
        description: "Software Development Course",
  
        school: "Sardar Patel University",
        graduationDate: "2017",
        description: "Physics",
      },
    ],
    links: [
      {
        label: "GitHub",
        link: "https://github.com/hardikhari96",
      },
      {
        label: "LinkedIn",
        link: "https://www.linkedin.com/in/hardikhari96/",
      },
    ],
    skills: [
      "JavaScript",
      "CSS",
      "NodeJS",
      "ExpressJs",
      "PostgreSQL",
      "MySQL",
      "Docker",
      "GIT",
      "K8",

    ],
    languages: ["English"],
    professionalSummary: `I am a passionate self-taught developer looking for new challenges in the field of Software Development, I have gained a broad base of knowledge and technical skills. I have gained in-depth knowledge in all layers of a web application, from front-end development to database management and back-end implementation..`,
    employmentHistory: [
      {
        jobTitle: "Full stack Developer",
        startDate : 'March-2022',
        endDate : "Present",
        employer: "Credify Technology Pvt. Ltd",
        achievements: [
  "ITX Alarms represents a web platform where technologies such as Arduino, NodeMCU, React and Firebase real-time database converge. Through the integration of NodeMCU devices and the arduino IDE, I have designed smart sensors capable of monitoring power plant ignition, instantly and continuously transmitting operating status data to Firebase.",
  
  "This ecosystem is further expanded with the addition of four additional sensors that measure temperature and humidity in the various equipment rooms of the station. This essential data is integrated and processed in real time through Firebase to provide a rich and dynamic view of the operating environment.",
  
  "The visual presentation of this data is carried out using React and CSS. This enables uninterrupted and aesthetic monitoring of the status of the power plant and the ambient conditions of the rooms.",
  
  "As a continuous improvement, I am implementing notifications through Telegram. This update will provide relevant alerts and notifications in real time.",
        ],
      },
  
      {
        jobTitle: "Full stack Developer",
        startDate : 'Nov-2021',
        endDate : "March-2022",
        employer: "Aarya Inforline",
        achievements: [
  "I have had the opportunity to work on a collaborative project focused on the creation of a booking engine for hotels. Since technologies like React were used as the core of the application, the backend was worked with Node.js and Express, which allowed me to build a custom API that powered the functionality of the booking engine. For data management, I implemented MongoDB, ensuring efficient and accessible storage. In addition, Material UI was used to ensure an aesthetic design and an intuitive user experience throughout the project.",
        ],
      },
  
      {
        jobTitle: "Full stack Developer",
        startDate : 'Sept-2020',
        endDate : "Oct-2021",
        employer: "Denim Softwares Pvt. Ltd.",
        achievements: [
  "This project highlights my ability to work with modern technologies like React and external APIs, as well as my ability to create a complete web application that meets usability and user experience standards.",
        ],
      }
    ],
  
    photo:
      "https://scontent.fbog2-4.fna.fbcdn.net/v/t1.6435-9/167942986_4363729256987825_9029499495646085524_n.jpg?_nc_cat=111&ccb=1-5&_nc_sid=09cbfe&_nc_eui2=AeFlP0IL-UlmxdHfXATvSkLoVjqUFgp-kOlWOpQWCn6Q6dfIgifPku5hr2rVFCqVYT7o4CdWb-JkeRb3r2Dk0Ox5&_nc_ohc=fiszoyxORFQAX8bE_Z2&_nc_ht=scontent.fbog2-4.fna&oh=00_AT9fLZKsBJajLj8uslmdNJ_sA19VuYFpdhmfn0ruMg2-RQ&oe=624B9C0F",
  };
  
  const formatResume = (r) => ({
    ...r,
    address: [r.country, r.city, r.postalCode].filter(Boolean).join(", "),
  });
  
  new Vue({
    el: "#app",
    data: formatResume(resume),
  });
  
  /**
   * Wait for animatable-component to be loaded (Only for VanillaJS)
   **/
  function animatableLoaded() {
    document.querySelector("body").classList.remove("d-none");
  }
  if (customElements) {
    customElements.whenDefined("animatable-component").then(animatableLoaded);
  } else animatableLoaded();