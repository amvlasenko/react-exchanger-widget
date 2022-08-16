import Currencies from './Currencies';
import {useEffect, useRef, useState} from 'react';

const Search = (props) => {
   const {searchCurrencies, setSearch, currencies, exchangeContext} = props;
   const [searchValue, setSearchValue] = useState('');
   const controlsRef = useRef(null);

   useEffect(() => {
      document.addEventListener('click', onClick);

      function onClick(evt) {
         if (controlsRef.current) {
            controlsRef.current.contains(evt.target) || setSearch(false);
         } else {
            document.removeEventListener('click', onClick);
         }
      }

      return () => document.removeEventListener('click', onClick);
   }, []);

   function handleKey(evt) {
      evt.preventDefault();
      setSearchValue(evt.target.value);
      searchCurrencies(searchValue);
   };

   return (
      <div className="controls" ref={controlsRef}>
         <input
            autoFocus
            type="search"
            className="user-search"
            placeholder="Search"
            value={searchValue || ''}
            onChange={(evt) => handleKey(evt)}
            aria-label="Enter the name or ticker of the currency to search"
         />
         <Currencies
            searchString={searchValue}
            currencies={currencies}
            setExchange={exchangeContext}
         />
      </div>
   );
};

export default Search;
