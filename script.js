const certificatePath = 'blank/blank.pdf'; // Ensure this is the correct relative path

const names = [
    "Abdul Aziz Nooruddin","Abdul Jabbar Fahad","Adil Mohammed","Adiva Nuha","Afnan Junaidi","Ahmed Ali","Ayesha Firdous","Ibrahim Jabri","Imroz Khan","M A AHZAM PARWEZ","Madiyah Numa","Md Abdul Rahman Iqbal","Md ANAS","MDAYAAN KHAN","Md Faqruddin Saad","Md Iqbal Pasha","Md Toufeeq Uddin","Mohammad Thoufeeq","Mohammed Abdul Samad Siddiqui","Mohammed Abubaker","Mohammed Faizullah","Mohammed Feroz","Mohammed inshad hassaan","Mohammed Irfan","Mohammed Wasif Ul Haq","Mohammed Zahid","Mohd Arhan Mustafa","Mohd IBRAHIM Anwar","Mohsin Baig","Naef Mohammed","Nausheen Begum","Rabiya Fatima","Rahil","Rayan Ayub Khan","Saboohi Fatima Shafia","Shaik Fouzan Uddin","Syeda Akhia Baseer","Syeda Safura Fatima","Syed Ibrahim Nazeer","Syed Moazam","Syed Mohtashim Faraz","Syed Nauman","Syed Sumair Uddin","SYED YASIRHUSSAIN","Sy Omer","T Mohamed Yaser","Yaqoob Riyaz Ki","Ziaulla"
];

document.getElementById('nameInput').addEventListener('input', (event) => {
    const query = event.target.value.toLowerCase();
    const suggestions = names.filter(name => name.toLowerCase().includes(query));
    displaySuggestions(suggestions);
});

function displaySuggestions(suggestions) {
    const suggestionsContainer = document.getElementById('suggestions');
    suggestionsContainer.innerHTML = ''; // Clear previous suggestions

    if (suggestions.length === 0) {
        suggestionsContainer.classList.add('hidden');
        return;
    }

    suggestionsContainer.classList.remove('hidden');
    
    // Set suggestions position
    const inputRect = document.getElementById('nameInput').getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    if (viewportHeight < inputRect.bottom + 150) { // 150px threshold
        suggestionsContainer.style.top = `${inputRect.top - suggestionsContainer.offsetHeight - 10}px`; // Adjusting above the input
    } else {
        suggestionsContainer.style.top = `${inputRect.bottom + window.scrollY + 5}px`; // Position below the input
    }
    
    suggestions.forEach(name => {
        const suggestionItem = document.createElement('div');
        suggestionItem.textContent = name;
        suggestionItem.className = 'p-2 cursor-pointer hover:bg-gray-100';
        suggestionItem.addEventListener('click', () => {
            document.getElementById('nameInput').value = name;
            suggestionsContainer.innerHTML = ''; // Clear suggestions
            suggestionsContainer.classList.add('hidden');
        });
        suggestionsContainer.appendChild(suggestionItem);
    });
}

document.getElementById('downloadBtn').addEventListener('click', async () => {
    const nameInput = document.getElementById('nameInput').value.trim();
    const message = document.getElementById('message');

    if (names.includes(nameInput)) {
        try {
            const pdfBytes = await fetch(certificatePath).then(res => {
                if (!res.ok) throw new Error('Network response was not ok');
                return res.arrayBuffer();
            });
            const pdfDoc = await PDFLib.PDFDocument.load(pdfBytes);
            
            const form = pdfDoc.getForm();
            const nameField = form.getTextField('NameField'); // Match this with your PDF field name
            nameField.setText(nameInput);
            
            const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
            const link = document.createElement('a');
            link.href = pdfDataUri;
            link.download = `${nameInput}_certificate.pdf`;
            document.body.appendChild(link); // Append link to body
            link.click(); // Trigger download
            link.remove(); // Clean up
            message.textContent = ''; // Clear any messages
        } catch (error) {
            console.error('Error downloading the certificate:', error);
            message.textContent = 'An error occurred while downloading. Please try again.';
        }
    } else {
        message.textContent = 'Certificate not found. Please check the name and try again.';
    }
});
