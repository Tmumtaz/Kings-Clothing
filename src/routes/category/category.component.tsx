import { useState, useEffect, Fragment } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';

import ProductCard from '../../components/product-card/product-card.component';
import Spinner from '../../components/spinner/spinner.component';

import { selectCategoriesIsLoading, selectCategoriesMap } from '../../store/categories/category.selector';

import { CategoryContainer, Title } from './category.styles';

type CategoryRouteParams = {
  category: string;
}

const Category = () => {
   const  { category } = useParams<keyof CategoryRouteParams>() as CategoryRouteParams;
   // get categories map from categories context
   const categoriesMap = useSelector(selectCategoriesMap);
   const isLoading = useSelector(selectCategoriesIsLoading);
   // get products
   const [ products, setProducts] = useState(categoriesMap[category]);
   
   // useEffect will update the products array that the category uses when category/categoriesMap updates 
   useEffect(() => {
    setProducts(categoriesMap[category]);
  }, [category, categoriesMap]);

   return (
    <Fragment>
      <Title>{category.toUpperCase()}</Title>
      {isLoading ? (
        <Spinner />
      ) : (
        <CategoryContainer>
          {products &&
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
        </CategoryContainer>
      )}
    </Fragment>
  );

};

export default Category;