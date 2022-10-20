import "./css/index.css";
import IMask from "imask";

//Update CSS
const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
//    ccBgColor01.setAttribute("fill","green")

const ccLogoCard = document.querySelector(".cc-logo span:nth-child(2) img")

function setCardType(type) {
   // ver no figma quais as cores para criar o array de cores
    const colors = {
        visa: ["#436D99","#2D57F2"],
        mastercard: ["#DF6F29","#C69347"],
        default: ["black", "gray"],
    }
    ccBgColor01.setAttribute("fill", colors[type][0])
    ccBgColor02.setAttribute("fill", colors[type][1])
    ccLogoCard.setAttribute("src",`cc-${type}.svg`)
}

globalThis.setCardType = setCardType

//get to CVC
const securityCode = document.querySelector("#security-code")
const securityCodePatten = {
    mask: "0000",
}
const securityCodeMasked = IMask(securityCode, securityCodePatten)

// Date
const expirationDate = document.querySelector("#expiration-date")
const expirationDatePatten = {
    mask: "MM{/}YY",
    blocks: {
        MM: {
            mask: IMask.MaskedRange,
            from: 1,
            to: 12
          },
          YY: {
            mask: IMask.MaskedRange,
            from: 20,
            to: 30
          },
    },
}
const expirationDateMasked = IMask(expirationDate, expirationDatePatten)

//--Numero do cartao
const cardNumber = document.querySelector("#card-number")
const cardNumberPatter = {
    mask: [
        {
            mask: '0000 0000 0000 0000',
            regex: /^4\d{0,15}/,
            cardtype: 'visa'
        },
        {
            mask: '0000 0000 0000 0000',
            regex: /^(5[1-5]\d{0,2}|22[2-9]\d{0,1}|2[3-7]\d{0,2})\d{0,12}/,
            cardtype: 'mastercard'
        },
        {
            mask: '0000 000000 00000',
            regex: /^3[47]\d{0,13}/,
            cardtype: 'american express'
        },
        {
            mask: '0000 0000 0000 0000',
            regex: /^(?:6011|65\d{0,2}|64[4-9]\d?)\d{0,12}/,
            cardtype: 'discover'
        },
        {
            mask: '0000 000000 0000',
            regex: /^3(?:0([0-5]|9)|[689]\d?)\d{0,11}/,
            cardtype: 'diners'
        },
        {
            mask: '0000 000000 00000',
            regex: /^(?:2131|1800)\d{0,11}/,
            cardtype: 'jcb15'
        },
        {
            mask: '0000 0000 0000 0000',
            regex: /^(?:35\d{0,2})\d{0,12}/,
            cardtype: 'jcb'
        },
        {
            mask: '0000 0000 0000 0000',
            regex: /^(?:5[0678]\d{0,2}|6304|67\d{0,2})\d{0,12}/,
            cardtype: 'maestro'
        },
        {
            mask: '0000 0000 0000 0000',
            cardtype: 'default'
        }
    ],
dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g,'')

    const foundMask = dynamicMasked.compiledMasks.find(({regex}) => number.match(regex))
    console.log(foundMask)
    return(foundMask)
  },
}
const cardNumberMasked = IMask(cardNumber, cardNumberPatter)

//Button
const addButton = document.querySelector("#add-card")
addButton.addEventListener("click", () => {
    console.log("Cartão adicionado")
})

document.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault()
})

// Fazendo os Updates nos Names

//Update Name Card
const cardHolder = document.querySelector("#card-holder")
cardHolder.addEventListener("input", () => {
    const ccHolder = document.querySelector(".cc-holder .value")

    ccHolder.innerText = cardHolder.value.length === 0 ? "FULANO DA SILVA" : cardHolder.value
})

//Update CVV
securityCodeMasked.on("accept", () => {
    const ccSecurity = document.querySelector(".cc-security .value")

    ccSecurity.innerText = securityCodeMasked.value.length === 0 ? "1234" : securityCodeMasked.value
})

//Update Number Card
cardNumberMasked.on("accept", () => {

    setCardType(cardNumberMasked.masked.currentMask.cardtype)

    const ccCardNumber = document.querySelector(".cc-number")

    ccCardNumber.innerText = cardNumberMasked.value.length === 0 ? "0000 0000 0000 0000" : cardNumberMasked.value
})

//Update Dare Expt
expirationDateMasked.on("accept", () => {
    const ccExpirationDate = document.querySelector(".cc-extra .value")

    ccExpirationDate.innerText = expirationDateMasked.value.length === 0 ? "00/00" : expirationDateMasked.value
})