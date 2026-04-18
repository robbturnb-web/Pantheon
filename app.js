// Pantheon Knowledge Platform - Main Application Logic

// Sample data for events and disclosures
const events = [
    // Ancient Events
    {
        id: 1,
        title: "Construction of the Great Pyramid of Giza",
        date: "2560 BCE",
        category: "ancient",
        description: "The Great Pyramid of Giza, built for Pharaoh Khufu, stands as one of the Seven Wonders of the Ancient World. This architectural marvel demonstrates the advanced engineering capabilities of ancient Egyptian civilization."
    },
    {
        id: 2,
        title: "Founding of Rome",
        date: "753 BCE",
        category: "ancient",
        description: "According to legend, Rome was founded by Romulus and Remus. The city would grow to become the center of one of history's most powerful empires, shaping Western civilization for millennia."
    },
    {
        id: 3,
        title: "Library of Alexandria Established",
        date: "283 BCE",
        category: "ancient",
        description: "The Library of Alexandria in Egypt was one of the largest and most significant libraries of the ancient world. It became a center of scholarship and learning, housing hundreds of thousands of scrolls."
    },
    {
        id: 4,
        title: "Eruption of Mount Vesuvius",
        date: "79 CE",
        category: "ancient",
        description: "The catastrophic eruption of Mount Vesuvius buried the Roman cities of Pompeii and Herculaneum, preserving them in volcanic ash and providing invaluable insights into ancient Roman life."
    },
    {
        id: 5,
        title: "Fall of the Roman Empire",
        date: "476 CE",
        category: "ancient",
        description: "The Western Roman Empire fell when the Germanic chieftain Odoacer deposed Emperor Romulus Augustulus, marking the end of ancient Rome and the beginning of the Middle Ages in Europe."
    },

    // Modern Events
    {
        id: 6,
        title: "World Wide Web Becomes Public",
        date: "August 6, 1991",
        category: "modern",
        description: "Tim Berners-Lee publicly released the World Wide Web, revolutionizing global communication and information sharing. This event marked the beginning of the modern internet era."
    },
    {
        id: 7,
        title: "Human Genome Project Completed",
        date: "April 14, 2003",
        category: "modern",
        description: "The Human Genome Project successfully mapped all the genes of human DNA, a groundbreaking achievement that opened new frontiers in medicine, genetics, and our understanding of human biology."
    },
    {
        id: 8,
        title: "First Image of a Black Hole",
        date: "April 10, 2019",
        category: "modern",
        description: "Scientists captured the first-ever image of a black hole, located in the M87 galaxy. This historic achievement confirmed Einstein's theory of general relativity and demonstrated international scientific collaboration."
    },
    {
        id: 9,
        title: "Paris Climate Agreement",
        date: "December 12, 2015",
        category: "modern",
        description: "195 nations adopted the Paris Agreement, the first-ever universal, legally binding global climate deal aimed at limiting global temperature rise and addressing climate change."
    },
    {
        id: 10,
        title: "COVID-19 Pandemic Declared",
        date: "March 11, 2020",
        category: "modern",
        description: "The World Health Organization declared COVID-19 a global pandemic, triggering worldwide public health responses and fundamentally changing how societies function, work, and interact."
    },

    // Disclosures
    {
        id: 11,
        title: "Pentagon UFO Videos Released",
        date: "April 27, 2020",
        category: "disclosure",
        description: "The U.S. Department of Defense officially released three Navy videos showing unidentified aerial phenomena (UAP), confirming their authenticity and sparking renewed interest in unexplained aerial objects."
    },
    {
        id: 12,
        title: "Snowden NSA Surveillance Disclosures",
        date: "June 6, 2013",
        category: "disclosure",
        description: "Edward Snowden revealed classified NSA documents exposing massive global surveillance programs, initiating worldwide debates about privacy, security, and government transparency."
    },
    {
        id: 13,
        title: "Panama Papers Released",
        date: "April 3, 2016",
        category: "disclosure",
        description: "11.5 million confidential documents from Panamanian law firm Mossack Fonseca were leaked, exposing widespread tax evasion and offshore financial activities of world leaders and public figures."
    },
    {
        id: 14,
        title: "WikiLeaks Publishes Afghan War Logs",
        date: "July 25, 2010",
        category: "disclosure",
        description: "WikiLeaks released over 91,000 classified military documents about the War in Afghanistan, revealing previously undisclosed information about civilian casualties and military operations."
    },
    {
        id: 15,
        title: "Vatican Archives Opened",
        date: "March 2, 2020",
        category: "disclosure",
        description: "The Vatican opened its secret archives covering the World War II papacy of Pope Pius XII, allowing historians unprecedented access to documents from one of the most controversial periods in Church history."
    },
    {
        id: 16,
        title: "Roswell Incident",
        date: "July 8, 1947",
        category: "disclosure",
        description: "The U.S. Army Air Forces announced the recovery of a 'flying disc' near Roswell, New Mexico. Though later explained as a weather balloon, the incident became central to UFO conspiracy theories and disclosure discussions."
    }
];

// State management
let currentFilter = 'all';
let searchQuery = '';

// DOM elements
const timeline = document.getElementById('timeline');
const searchInput = document.getElementById('searchInput');
const navButtons = document.querySelectorAll('.nav-btn');
const statsElements = {
    total: document.getElementById('totalEvents'),
    ancient: document.getElementById('ancientEvents'),
    modern: document.getElementById('modernEvents'),
    disclosures: document.getElementById('disclosures')
};

// Initialize the application
function init() {
    renderEvents();
    updateStats();
    attachEventListeners();
}

// Render events to the timeline
function renderEvents() {
    const filteredEvents = filterEvents();

    timeline.innerHTML = '';

    if (filteredEvents.length === 0) {
        timeline.innerHTML = '<p style="text-align: center; color: #7f8c8d; padding: 2rem;">No events found matching your criteria.</p>';
        return;
    }

    filteredEvents.forEach(event => {
        const eventCard = createEventCard(event);
        timeline.appendChild(eventCard);
    });
}

// Create an event card element
function createEventCard(event) {
    const card = document.createElement('div');
    card.className = `event-card ${event.category}`;
    card.innerHTML = `
        <div class="event-header">
            <span class="event-date">${event.date}</span>
            <span class="event-category ${event.category}">${event.category}</span>
        </div>
        <h3 class="event-title">${event.title}</h3>
        <p class="event-description">${event.description}</p>
    `;
    return card;
}

// Filter events based on current filter and search query
function filterEvents() {
    return events.filter(event => {
        const matchesFilter = currentFilter === 'all' || event.category === currentFilter;
        const matchesSearch = searchQuery === '' ||
            event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.date.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesFilter && matchesSearch;
    });
}

// Update statistics
function updateStats() {
    const ancientCount = events.filter(e => e.category === 'ancient').length;
    const modernCount = events.filter(e => e.category === 'modern').length;
    const disclosureCount = events.filter(e => e.category === 'disclosure').length;

    statsElements.total.textContent = events.length;
    statsElements.ancient.textContent = ancientCount;
    statsElements.modern.textContent = modernCount;
    statsElements.disclosures.textContent = disclosureCount;
}

// Attach event listeners
function attachEventListeners() {
    // Navigation buttons
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active state
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Update filter
            currentFilter = button.getAttribute('data-filter');
            renderEvents();
        });
    });

    // Search input
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderEvents();
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
