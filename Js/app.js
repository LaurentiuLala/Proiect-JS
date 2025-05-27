import { login, register } from './userService.js';
import { getMasini, createMasina } from './masiniService.js';
import { getLocatii, createLocatie } from './locatiiService.js';
import { getInchirieri, createInchiriere } from './InchirieriService.js';
import { getReviews, createReview } from './ReviewsService.js';
import { getRole, setAuth, clearAuth } from './AppState.js';

async function handleRegister() {
    const data = {
        name: document.getElementById('registerName').value,
        lastName: document.getElementById('registerLastName').value,
        email: document.getElementById('registerEmail').value,
        password: document.getElementById('registerPassword').value,
        role: document.getElementById('registerRole').value
    };

    const result = await register(data);
    if (result.success) {
        alert("Register successful");
        document.getElementById('registerName').value = '';
        document.getElementById('registerLastName').value = '';
        document.getElementById('registerEmail').value = '';
        document.getElementById('registerPassword').value = '';
    } else {
        alert("Register failed: " + (result.message || 'Unknown error'));
    }
}

async function handleLogin() {
    const data = {
        email: document.getElementById('loginEmail').value,
        password: document.getElementById('loginPassword').value
    };

    const result = await login(data);
    if (result.success && result.body) {
        setAuth(result.body.token, result.body.role);
        document.getElementById('auth').style.display = 'none';
        document.getElementById('main').classList.remove('hidden');

        loadMasini();
        loadLocatii();
    } else {
        alert("Login failed: " + (result.message || 'Invalid credentials'));
    }
}

function logout() {
    clearAuth();
    document.getElementById('auth').style.display = 'block';
    document.getElementById('main').classList.add('hidden');
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPassword').value = '';
}

async function loadMasini() {
    const result = await getMasini();
    if (result.success && result.body) {
        const list = document.getElementById('masinaList');
        list.innerHTML = '';
        result.body.forEach(m => {
            const li = document.createElement('li');
            li.textContent = `${m.nume} - ${m.tip} - ${m.pret} RON`;
            list.appendChild(li);
        });
    }
}

async function handleCreateMasina() {
    if (getRole() !== 'ADMIN') {
        alert("Nu ai drepturi de administrator.");
        return;
    }

    const data = {
        nume: document.getElementById('numeMasina').value,
        tip: document.getElementById('tipMasina').value,
        pret: parseFloat(document.getElementById('pretMasina').value)
    };

    if (!data.nume || !data.tip || !data.pret) {
        alert("Te rog completează toate câmpurile.");
        return;
    }

    const result = await createMasina(data);
    if (result.success) {
        alert("Mașină adăugată");
        loadMasini();
        document.getElementById('numeMasina').value = '';
        document.getElementById('tipMasina').value = '';
        document.getElementById('pretMasina').value = '';
    } else {
        alert("Eroare la adăugare");
    }
}

async function loadLocatii() {
    const result = await getLocatii();
    if (result.success && result.body) {
        const list = document.getElementById('locatieList');
        const select = document.getElementById('locatieInchiriereSelect');
        list.innerHTML = '';
        select.innerHTML = '<option value="">Selectează locația</option>';
        
        result.body.forEach(l => {
            const li = document.createElement('li');
            li.textContent = `${l.nume} - ${l.adresa}`;
            list.appendChild(li);

            const option = document.createElement('option');
            option.value = l.id;
            option.text = l.nume;
            select.appendChild(option);
        });
    }
}

async function handleCreateLocatie() {
    if (getRole() !== 'ADMIN') {
        alert("Doar adminii pot adăuga locații.");
        return;
    }

    const data = {
        nume: document.getElementById('numeLocatie').value,
        adresa: document.getElementById('adresaLocatie').value
    };

    if (!data.nume || !data.adresa) {
        alert("Te rog completează toate câmpurile.");
        return;
    }

    const result = await createLocatie(data);
    if (result.success) {
        alert("Locație adăugată");
        loadLocatii();
        document.getElementById('numeLocatie').value = '';
        document.getElementById('adresaLocatie').value = '';
    } else {
        alert("Eroare la creare locație");
    }
}

async function loadMasiniPentruInchiriere() {
    const result = await getMasini();
    if (result.success && result.body) {
        const select = document.getElementById('masinaInchiriereSelect');
        select.innerHTML = '<option value="">Selectează mașina</option>';
        result.body.forEach(m => {
            const option = document.createElement('option');
            option.value = m.id;
            option.text = `${m.nume} - ${m.pret} RON`;
            select.appendChild(option);
        });
    }
}

async function inchiriazaMasina() {
    const data = {
        masinaId: document.getElementById('masinaInchiriereSelect').value,
        locatieId: document.getElementById('locatieInchiriereSelect').value,
        data: document.getElementById('dataInchiriere').value
    };

    if (!data.masinaId || !data.locatieId || !data.data) {
        alert("Te rog completează toate câmpurile.");
        return;
    }

    const result = await createInchiriere(data);
    if (result.success) {
        alert("Închiriere realizată!");
        loadInchirieri();
        document.getElementById('dataInchiriere').value = '';
    } else {
        alert("Eroare la închiriere.");
    }
}

async function loadInchirieri() {
    const result = await getInchirieri();
    if (result.success && result.body) {
        const list = document.getElementById('inchirieriList');
        const select = document.getElementById('inchiriereReviewSelect');
        list.innerHTML = '';
        select.innerHTML = '<option value="">Selectează închirierea</option>';
        
        result.body.forEach(i => {
            const li = document.createElement('li');
            li.textContent = `Mașină: ${i.masina?.nume || 'N/A'}, Locație: ${i.locatie?.nume || 'N/A'}, Data: ${i.data}`;
            list.appendChild(li);

            const option = document.createElement('option');
            option.value = i.id;
            option.text = `${i.masina?.nume || 'N/A'} - ${i.data}`;
            select.appendChild(option);
        });
    }
}

async function adaugaReview() {
    const data = {
        inchiriereId: document.getElementById('inchiriereReviewSelect').value,
        rating: parseInt(document.getElementById('reviewRating').value),
        comentariu: document.getElementById('reviewComentariu').value
    };

    if (!data.inchiriereId || !data.comentariu) {
        alert("Te rog completează toate câmpurile.");
        return;
    }

    const result = await createReview(data);
    if (result.success) {
        alert("Review adăugat!");
        loadReviews();
        document.getElementById('reviewComentariu').value = '';
    } else {
        alert("Eroare la review.");
    }
}

async function loadReviews() {
    const result = await getReviews();
    if (result.success && result.body) {
        const list = document.getElementById('reviewsList');
        list.innerHTML = '';
        result.body.forEach(r => {
            const li = document.createElement('li');
            li.textContent = `⭐ ${r.rating}/5 - ${r.comentariu}`;
            list.appendChild(li);
        });
    }
}

window.handleRegister = handleRegister;
window.handleLogin = handleLogin;
window.logout = logout;
window.loadMasini = loadMasini;
window.handleCreateMasina = handleCreateMasina;
window.loadLocatii = loadLocatii;
window.handleCreateLocatie = handleCreateLocatie;
window.loadMasiniPentruInchiriere = loadMasiniPentruInchiriere;
window.inchiriazaMasina = inchiriazaMasina;
window.loadInchirieri = loadInchirieri;
window.adaugaReview = adaugaReview;
window.loadReviews = loadReviews;
