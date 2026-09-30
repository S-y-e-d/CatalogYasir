import './Wishlist.css'

function Wishlist() {

    const wishlist = []


  return (
    <>
      <div className="wishlist">
        {wishlist.length === 0 && <span className='wishlist-empty'>Add items to wishlist by clicking the heart</span>}
      </div>
    </>
  );
}

export default Wishlist;
