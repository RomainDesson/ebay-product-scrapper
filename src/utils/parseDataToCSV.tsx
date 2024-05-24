import { EbayObjectType } from "../component/home";

export const parseDataToCSV = (data: EbayObjectType[]) => {
    const CSVArray = []
    CSVArray.push(['Numéro article', 'Nom', 'Description', 'Condition', 'Quantité', 'Prix de vente', "Prix d'achat", "Prix total", "Prix total", "Marge/bénéfice", "Marge/bénéfice", 'Image', 'URL'])
    data.forEach((datum) => {
        CSVArray.push([null, null, datum.title, datum.condition, datum.quantity, datum.price, null, null, null, null, null, datum.image, datum.url])
    })
    return CSVArray
}
