import {useEffect, useState} from 'react';
import Currency from './Currency';

const Currencies = (props) => {
   const {searchString, currencies, setExchange} = props;
   const [localCurrenciesList, setLocalCurrenciesList] = useState(currencies);

   useEffect(() => {
      setLocalCurrenciesList(
         currencies.filter(
            (currency) =>
               currency.name.toString().toLowerCase().includes(searchString.toString().toLowerCase()) ||
               currency.ticker.toString().toLowerCase().includes(searchString.toString().toLowerCase())
         )
      );
   }, [searchString]);

   return (
      <div className="currencies">
         {localCurrenciesList.length > 0
            ? localCurrenciesList.map((currency) => (
               <Currency
                  key={currency.ticker}
                  {...currency}
                  name={currency.name}
                  setExchange={setExchange}
               />
            ))
            : <div className="exchange-currency empty">Ничего не найдено</div>
         }
      </div>
   );
};

export default Currencies;
