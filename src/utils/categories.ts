export const CATEGORIES = [
    'Lait / Oeufs',
    'Yaourts',
    'Fromages',
    'Céréales',
    'Boulangerie',
    'Viandes',
    'Boucherie / Charcuterie',
    'Poissons',
    'Conserves',
    'Fruits & Légumes',
    'Congelés',
    'Féculents',
    'Sauces',
    'Condiments',
    'Gâteaux sucrés',
    'Confiserie',
    'Plats préparés',
    'Boissons'
]

export const getCategoriesOptions = () => {
    const defaultValue = { libelle: 'Choisissez une catégorie', value: '' }
    return [defaultValue, ...CATEGORIES.map((category) => ({ libelle: category, value: category }))]
}
