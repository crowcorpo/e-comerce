import { useState, useEffect } from 'react';
import { supabase } from './superbase.ts';
import { useAuth } from './authcontext.jsx';

const CATEGORY_SIZES = {
    sneakers : ['36','37','38','39','40','41','42','43','44','45'],
    clothes  : ['XS','S','M','L','XL','XXL'],
    pants    : ['34','36','38','40','42','44','46','48'],
    caps     : [], // custom sizes added by admin
};

const CATEGORIES = ['sneakers','clothes','pants','caps'];

function Test2({ onProductClick }) {

    const { isAdmin } = useAuth();

    const [ products, setproducts ] = useState([]);

    const [ showUpload, setshowUpload ]     = useState(false);
    const [ uploadFile, setuploadFile ]     = useState(null);
    const [ uploadName, setuploadName ]     = useState('');
    const [ uploadPrice, setuploadPrice ]   = useState('');
    const [ uploadCat, setuploadCat ]       = useState('sneakers');

    const [ showConfirm, setshowConfirm ]   = useState(false);
    const [ selectedId, setselectedId ]     = useState(null);
    const [ selectedImg, setselectedImg ]   = useState(null);

    const [ showEdit, setshowEdit ]         = useState(false);
    const [ editId, seteditId ]             = useState(null);
    const [ editOldImg, seteditOldImg ]     = useState(null);
    const [ editFile, seteditFile ]         = useState(null);
    const [ editName, seteditName ]         = useState('');
    const [ editPrice, seteditPrice ]       = useState('');
    const [ editCat, seteditCat ]           = useState('sneakers');

    // ==========================
    // fetch products
    // ==========================
    const getproducts = async () => {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) { console.error(error); return; }
        setproducts(data);
    }

    useEffect(() => { getproducts(); }, []);

    // ==========================
    // listen for upload event from navbar
    // ==========================
    useEffect(() => {
        const open = () => { setshowUpload(true); document.body.style.overflow = 'hidden'; };
        window.addEventListener('gallery-upload-open', open);
        return () => window.removeEventListener('gallery-upload-open', open);
    }, []);

    // ==========================
    // upload product
    // ==========================
    const confirmUpload = async () => {
        if (!uploadFile || !uploadName || !uploadPrice) return;

        const uniquename = `${Date.now()}_${uploadFile.name}`;
        const filepath = `admin/assets/gallery/${uniquename}`;

        const { error: uploaderror } = await supabase.storage
            .from('admin-images')
            .upload(filepath, uploadFile);
        if (uploaderror) { console.error(uploaderror); return; }

        const { data: pub } = supabase.storage
            .from('admin-images')
            .getPublicUrl(filepath);

        const { error: dberror } = await supabase
            .from('products')
            .insert({
                name      : uploadName,
                price     : parseFloat(uploadPrice),
                image_url : pub.publicUrl,
                category  : uploadCat,
            });
        if (dberror) { console.error(dberror); return; }

        setuploadFile(null);
        setuploadName('');
        setuploadPrice('');
        setuploadCat('sneakers');
        setshowUpload(false);
        document.body.style.overflow = 'auto';
        await getproducts();
    }

    // ==========================
    // delete product
    // ==========================
    const remove = async () => {
        const { error: dberror } = await supabase
            .from('products')
            .delete()
            .eq('id', selectedId);
        if (dberror) { console.error(dberror); return; }

        const path = selectedImg.split('/admin-images/')[1];
        if (path) await supabase.storage.from('admin-images').remove([decodeURIComponent(path)]);

        setproducts(prev => prev.filter(p => p.id !== selectedId));
        setselectedId(null);
        setselectedImg(null);
        setshowConfirm(false);
        document.body.style.overflow = 'auto';
    }

    // ==========================
    // edit product
    // ==========================
    const confirmEdit = async () => {
        let newImageUrl = null;

        if (editFile) {
            const oldpath = editOldImg.split('/admin-images/')[1];
            if (oldpath) await supabase.storage.from('admin-images').remove([decodeURIComponent(oldpath)]);

            const uniquename = `${Date.now()}_${editFile.name}`;
            const filepath = `admin/assets/gallery/${uniquename}`;
            const { error: uploaderror } = await supabase.storage
                .from('admin-images')
                .upload(filepath, editFile);
            if (uploaderror) { console.error(uploaderror); return; }

            const { data: pub } = supabase.storage.from('admin-images').getPublicUrl(filepath);
            newImageUrl = pub.publicUrl;
        }

        const updates = {
            name     : editName,
            price    : parseFloat(editPrice),
            category : editCat,
            ...(newImageUrl && { image_url: newImageUrl })
        };

        const { error } = await supabase.from('products').update(updates).eq('id', editId);
        if (error) { console.error(error); return; }

        seteditId(null); seteditOldImg(null); seteditFile(null);
        seteditName(''); seteditPrice(''); seteditCat('sneakers');
        setshowEdit(false);
        document.body.style.overflow = 'auto';
        await getproducts();
    }

    const openEdit = (product) => {
        seteditId(product.id);
        seteditOldImg(product.image_url);
        seteditName(product.name);
        seteditPrice(String(product.price));
        seteditCat(product.category || 'sneakers');
        setshowEdit(true);
        document.body.style.overflow = 'hidden';
    }

    const closeUpload = () => {
        setuploadFile(null); setuploadName(''); setuploadPrice(''); setuploadCat('sneakers');
        setshowUpload(false);
        document.body.style.overflow = 'auto';
    }

    const closeEdit = () => {
        seteditId(null); seteditFile(null); seteditName(''); seteditPrice('');
        setshowEdit(false);
        document.body.style.overflow = 'auto';
    }

    return (
        <>
            <div id="img7awifather">
                <div id="img7awi">
                    { products.map((product) => (
                        <div className="product-card" key={product.id}>
                            <div className="product-img-wrap" onClick={() => onProductClick(product.id)} style={{ cursor:'pointer' }}>
                                <img src={product.image_url} alt={product.name} />
                                { isAdmin &&
                                    <div id="imgbtngroup">
                                        <button id="edit" onClick={(e) => { e.stopPropagation(); openEdit(product); }}>
                                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                            </svg>
                                            edit
                                        </button>
                                        <button id="delete" onClick={(e) => {
                                            e.stopPropagation();
                                            setselectedId(product.id);
                                            setselectedImg(product.image_url);
                                            setshowConfirm(true);
                                            document.body.style.overflow = 'hidden';
                                        }}>
                                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                <polyline points="3 6 5 6 21 6"/>
                                                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                                                <path d="M10 11v6"/><path d="M14 11v6"/>
                                                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                                            </svg>
                                            delete
                                        </button>
                                    </div>
                                }
                            </div>
                            <div className="product-info">
                                <span className="product-name" onClick={() => onProductClick(product.id)} style={{ cursor:'pointer' }}>{ product.name }</span>
                                <span className="product-price">${ Number(product.price).toFixed(2) }</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ======= UPLOAD MODAL ======= */}
            { showUpload &&
                <div id="confather">
                    <div id="confirmidel" className="upload-modal">
                        <h1 id="text">add new product</h1>

                        <div className="upload-img-preview" onClick={() => document.getElementById('real-file-input').click()}>
                            { uploadFile
                                ? <img src={URL.createObjectURL(uploadFile)} alt="preview" />
                                : <>
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                        <polyline points="17 8 12 3 7 8"/>
                                        <line x1="12" y1="3" x2="12" y2="15"/>
                                    </svg>
                                    <span>click to choose image</span>
                                </>
                            }
                        </div>
                        <input id="real-file-input" type="file" accept="image/*" style={{ display:'none' }}
                            onChange={(e) => setuploadFile(e.target.files[0])}
                        />

                        <input className="product-input" type="text" placeholder="product name"
                            value={uploadName} onChange={(e) => setuploadName(e.target.value)}
                        />

                        <div className="price-input-wrap">
                            <span className="price-symbol">$</span>
                            <input className="product-input price-input" type="number" placeholder="0.00"
                                min="0" step="0.01" value={uploadPrice}
                                onChange={(e) => setuploadPrice(e.target.value)}
                            />
                        </div>

                        {/* category selector */}
                        <div className="category-selector">
                            { CATEGORIES.map(cat => (
                                <button
                                    key={cat}
                                    className={`cat-btn${ uploadCat === cat ? ' cat-active' : '' }`}
                                    onClick={() => setuploadCat(cat)}
                                >
                                    { cat }
                                </button>
                            ))}
                        </div>

                        <div id="slmodalbtns">
                            <button id="koko" onClick={closeUpload}>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                                </svg>
                                cancel
                            </button>
                            <button id="koko" className="confirm-btn"
                                onClick={confirmUpload}
                                disabled={!uploadFile || !uploadName || !uploadPrice}
                            >
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <polyline points="20 6 9 17 4 12"/>
                                </svg>
                                confirm
                            </button>
                        </div>
                    </div>
                </div>
            }

            {/* ======= DELETE MODAL ======= */}
            { showConfirm &&
                <div id="confather">
                    <div id="confirmidel">
                        <h1 id="text">delete this product?</h1>
                        <p className="modal-sub">this cannot be undone</p>
                        <div id="slmodalbtns">
                            <button id="koko" onClick={() => {
                                setshowConfirm(false); setselectedId(null); setselectedImg(null);
                                document.body.style.overflow = 'auto';
                            }}>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                                </svg>
                                cancel
                            </button>
                            <button id="koko" className="danger-btn" onClick={remove}>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <polyline points="3 6 5 6 21 6"/>
                                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                                    <path d="M10 11v6"/><path d="M14 11v6"/>
                                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                                </svg>
                                delete
                            </button>
                        </div>
                    </div>
                </div>
            }

            {/* ======= EDIT MODAL ======= */}
            { showEdit &&
                <div id="confather">
                    <div id="confirmidel" className="upload-modal">
                        <h1 id="text">edit product</h1>

                        <div className="upload-img-preview" onClick={() => document.getElementById('edit-file-input').click()}>
                            { editFile
                                ? <img src={URL.createObjectURL(editFile)} alt="preview" />
                                : <img src={editOldImg} alt="current" />
                            }
                            <div className="img-overlay-hint">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                    <polyline points="17 8 12 3 7 8"/>
                                    <line x1="12" y1="3" x2="12" y2="15"/>
                                </svg>
                                change image
                            </div>
                        </div>
                        <input id="edit-file-input" type="file" accept="image/*" style={{ display:'none' }}
                            onChange={(e) => seteditFile(e.target.files[0])}
                        />

                        <input className="product-input" type="text" placeholder="product name"
                            value={editName} onChange={(e) => seteditName(e.target.value)}
                        />

                        <div className="price-input-wrap">
                            <span className="price-symbol">$</span>
                            <input className="product-input price-input" type="number" placeholder="0.00"
                                min="0" step="0.01" value={editPrice}
                                onChange={(e) => seteditPrice(e.target.value)}
                            />
                        </div>

                        {/* category selector */}
                        <div className="category-selector">
                            { CATEGORIES.map(cat => (
                                <button
                                    key={cat}
                                    className={`cat-btn${ editCat === cat ? ' cat-active' : '' }`}
                                    onClick={() => seteditCat(cat)}
                                >
                                    { cat }
                                </button>
                            ))}
                        </div>

                        <div id="slmodalbtns">
                            <button id="koko" onClick={closeEdit}>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                                </svg>
                                cancel
                            </button>
                            <button id="koko" className="confirm-btn" onClick={confirmEdit}>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <polyline points="20 6 9 17 4 12"/>
                                </svg>
                                save
                            </button>
                        </div>
                    </div>
                </div>
            }
        </>
    );
}

export default Test2;