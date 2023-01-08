import { EbayObjectType } from "../component/home";

export const parseDataToCSV = (data: EbayObjectType[]) => {
    const CSVArray = []
    CSVArray.push(['Numéro article', 'Catégorie', 'Titre', 'Référence', 'Condition', 'Quantité', 'Prix de vente', "Prix d'achat", 'Image', 'URL'])
    data.forEach((datum) => {
        CSVArray.push([null, null, datum.title, datum.ref, datum.condition, datum.quantity, datum.price, null, datum.image, datum.url])
    })
    return CSVArray
}
