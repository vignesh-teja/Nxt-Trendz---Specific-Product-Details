// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {similarItemDetails} = props
  const {imageUrl, title, brand, price, rating} = similarItemDetails
  return (
    <li className="similar-product-item">
      <img
        src={imageUrl}
        className="similar-item-img"
        alt={`similar product ${title}`}
      />
      <h1 className="similar-product-title">{title}</h1>
      <p className="similar-product-brand">By {brand}</p>
      <div className="price-and-rating-section">
        <p className="similar-product-price">RS {price}/-</p>
        <p className="rating-star-section">
          {rating}
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            className="rating-star-img"
            alt="star"
          />
        </p>
      </div>
    </li>
  )
}

export default SimilarProductItem
