export const CATEGORIES = [
    'Entretien',
    'Hygiène',
    'Fruits & Légumes',
    'Lait / Oeufs',
    'Yaourts',
    'Fromages',
    'Boulangerie',
    'Céréales',
    'Boucherie / Charcuterie',
    'Viandes',
    'Poissons',
    'Plats préparés',
    'Congelés',
    'Féculents',
    'Conserves',
    'Sauces',
    'Condiments',
    'Gâteaux sucrés',
    'Confiserie',
    'Boissons',
    'Autres'
]

export const getCategoriesOptions = () => {
    const defaultValue = { libelle: 'Choisissez une catégorie', value: '' }
    return [defaultValue, ...CATEGORIES.map((category) => ({ libelle: category, value: category }))]
}
