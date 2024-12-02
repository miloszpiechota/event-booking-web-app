export const validateEventName = (name) => {
    if (!name) return 'Nazwa wydarzenia jest wymagana.';
    if (name.length < 3) return 'Nazwa wydarzenia musi mieć co najmniej 3 znaki.';
    return '';
};

export const validateDate = (date, field, startDate = null) => {
    if (!date) return `${field === 'start_date' ? 'Data rozpoczęcia' : 'Data zakończenia'} jest wymagana.`;
    const selectedDate = new Date(date);
    if (field === 'end_date' && startDate && new Date(startDate) > selectedDate) {
        return 'Data zakończenia nie może być wcześniejsza niż data rozpoczęcia.';
    }
    return '';
};

export const validateTickets = (number) => {
    if (!number) return 'Liczba biletów jest wymagana.';
    if (isNaN(number) || number <= 0) return 'Liczba biletów musi być większa niż 0.';
    return '';
};

export const validateDescription = (description) => {
    if (!description) return 'Opis wydarzenia jest wymagany.';
    if (description.length < 10) return 'Opis musi mieć co najmniej 10 znaków.';
    return '';
};

export const validateLocationName = (locationName) => {
    if (!locationName) return "Nazwa lokalizacji jest wymagana.";
    if (locationName.length < 3) return "Nazwa lokalizacji musi mieć co najmniej 3 znaki.";
    return "";
  };

  export const validateContactInfo = (contactInfo) => {
    if (!contactInfo) return 'Informacje kontaktowe są wymagane.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactInfo) && !/^\+?[0-9]{7,15}$/.test(contactInfo)) {
        return 'Podaj poprawny adres e-mail lub numer telefonu.';
    }
    return '';
};

export const validatePhotoUrl = (photoUrl) => {
    if (!photoUrl) return 'URL zdjęcia jest wymagany.';
    if (!/^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/.test(photoUrl)) {
        return 'Podaj poprawny URL zdjęcia (format: jpg, jpeg, png, webp, gif).';
    }
    return '';
};