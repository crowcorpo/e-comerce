import { useState, useEffect, useRef } from 'react';
import { supabase } from './superbase.ts';
import { useAuth } from './authcontext.jsx';
import './shoppage2.css';

const WILAYAS = [
    'Adrar','Chlef','Laghouat','Oum El Bouaghi','Batna','Béjaïa','Biskra','Béchar',
    'Blida','Bouira','Tamanrasset','Tébessa','Tlemcen','Tiaret','Tizi Ouzou','Alger',
    'Djelfa','Jijel','Sétif','Saïda','Skikda','Sidi Bel Abbès','Annaba','Guelma',
    'Constantine','Médéa','Mostaganem','M\'Sila','Mascara','Ouargla','Oran','El Bayadh',
    'Illizi','Bordj Bou Arréridj','Boumerdès','El Tarf','Tindouf','Tissemsilt',
    'El Oued','Khenchela','Souk Ahras','Tipaza','Mila','Aïn Defla','Naâma',
    'Aïn Témouchent','Ghardaïa','Relizane'
];

function ShopPage2({ productId, onBack }) {

    const { isAdmin } = useAuth();

    const [ product, setproduct ]           = useState(null);
    const [ images, setimages ]             = useState([]);
    const [ currentImg, setcurrentImg ]     = useState(0);
    const [ sizes, setsizes ]               = useState([]);
    const [ selectedSize, setselectedSize ] = useState(null);
    const [ quantity, setquantity ]         = useState(1);
    const [ loading, setloading ]           = useState(true);

    const [ showDescEdit, setshowDescEdit ] = useState(false);
    const [ descDraft, setdescDraft ]       = useState('');

    const [ newSize, setnewSize ]           = useState('');

    const [ showOrder, setshowOrder ]       = useState(false);
    const [ orderForm, setorderForm ]       = useState({
        fullname: '', email: '', phone: '', address: '', city: '', wilaya: ''
    });
    const [ sending, setsending ]           = useState(false);
    const [ sent, setsent ]                 = useState(false);
    const [ orderError, setorderError ]     = useState('');

    const touchstartX = useRef(null);

    const getproduct = async () => {
        setloading(true);
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', productId)
            .single();
        if (error) { console.error(error); setloading(false); return; }
        setproduct(data);
        setloading(false);
    }

    const getimages = async () => {
        const { data, error } = await supabase
            .from('product_images')
            .select('*')
            .eq('product_id', productId)
            .order('created_at', { ascending: true });
        if (error) { console.error(error); return; }
        setimages(data || []);
    }

    const getsizes = async () => {
        const { data, error } = await supabase
            .from('product_sizes')
            .select('*')
            .eq('product_id', productId)
            .order('created_at', { ascending: true });
        if (error) { console.error(error); return; }
        setsizes(data || []);
    }

    useEffect(() => {
        getproduct();
        getimages();
        getsizes();
    }, [ productId ]);

    const allImages = product
        ? [ { id: 'main', image_url: product.image_url }, ...images ]
        : images;

    const prevImg = () => setcurrentImg(i => (i - 1 + allImages.length) % allImages.length);
    const nextImg = () => setcurrentImg(i => (i + 1) % allImages.length);

    const onTouchStart = (e) => { touchstartX.current = e.touches[0].clientX; }
    const onTouchEnd   = (e) => {
        if (touchstartX.current === null) return;
        const diff = touchstartX.current - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) { diff > 0 ? nextImg() : prevImg(); }
        touchstartX.current = null;
    }

    const addImage = async (file) => {
        if (!file) return;
        const uniquename = `${Date.now()}_${file.name}`;
        const filepath = `admin/assets/gallery/${uniquename}`;
        const { error: uploaderror } = await supabase.storage
            .from('admin-images')
            .upload(filepath, file);
        if (uploaderror) { console.error(uploaderror); return; }
        const { data: pub } = supabase.storage.from('admin-images').getPublicUrl(filepath);
        const { error: dberror } = await supabase
            .from('product_images')
            .insert({ product_id: productId, image_url: pub.publicUrl });
        if (dberror) { console.error(dberror); return; }
        await getimages();
    }

    const deleteCurrentImage = async () => {
        if (currentImg === 0) return;
        const img = images[currentImg - 1];
        if (!img) return;
        const path = img.image_url.split('/admin-images/')[1];
        if (path) await supabase.storage.from('admin-images').remove([decodeURIComponent(path)]);
        await supabase.from('product_images').delete().eq('id', img.id);
        await getimages();
        setcurrentImg(i => Math.max(0, i - 1));
    }

    const addSize = async () => {
        const trimmed = newSize.trim();
        if (!trimmed) return;
        if (sizes.find(s => s.size.toLowerCase() === trimmed.toLowerCase())) return;
        const { data, error } = await supabase
            .from('product_sizes')
            .insert({ product_id: productId, size: trimmed, available: true })
            .select()
            .single();
        if (error) { console.error(error); return; }
        setsizes(prev => [...prev, data]);
        setnewSize('');
    }

    const deleteSize = async (sizeRow) => {
        await supabase.from('product_sizes').delete().eq('id', sizeRow.id);
        setsizes(prev => prev.filter(s => s.id !== sizeRow.id));
        if (selectedSize === sizeRow.size) setselectedSize(null);
    }

    const toggleSize = async (sizeRow) => {
        await supabase.from('product_sizes').update({ available: !sizeRow.available }).eq('id', sizeRow.id);
        setsizes(prev => prev.map(s => s.id === sizeRow.id ? { ...s, available: !s.available } : s));
        if (selectedSize === sizeRow.size && sizeRow.available) setselectedSize(null);
    }

    const saveDesc = async () => {
        const { error } = await supabase.from('products').update({ description: descDraft }).eq('id', productId);
        if (error) { console.error(error); return; }
        setproduct(prev => ({ ...prev, description: descDraft }));
        setshowDescEdit(false);
        document.body.style.overflow = 'auto';
    }

    const sendOrder = async () => {
        const { fullname, email, phone, address, city, wilaya } = orderForm;
        if (!fullname || !email || !phone || !address || !city || !wilaya) {
            setorderError('please fill in all fields'); return;
        }
        setorderError('');
        setsending(true);
        try {
            const res = await fetch('https://formspree.io/f/mdaljepz', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    product_name  : product.name,
                    product_price : `$${Number(product.price).toFixed(2)}`,
                    category      : product.category,
                    size          : selectedSize,
                    quantity      : quantity,
                    total_price   : `$${(Number(product.price) * quantity).toFixed(2)}`,
                    fullname, email, phone, address, city, wilaya,
                    ordered_at    : new Date().toLocaleString(),
                })
            });
            if (res.ok) { setsent(true); }
            else { setorderError('something went wrong, please try again'); }
        } catch (err) { setorderError('something went wrong, please try again'); }
        setsending(false);
    }

    const openOrder = () => {
        setshowOrder(true); setsent(false); setorderError('');
        setorderForm({ fullname:'', email:'', phone:'', address:'', city:'', wilaya:'' });
        document.body.style.overflow = 'hidden';
    }

    const closeOrder = () => { setshowOrder(false); document.body.style.overflow = 'auto'; }

    if (loading) return <div id="sp2-loading"><div id="sp2-spinner"/></div>;
    if (!product) return <div id="sp2-loading"><p>product not found</p></div>;

    return (
        <>
            <div id="sp2-wrap">

                <button id="sp2-back" onClick={onBack}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="15 18 9 12 15 6"/>
                    </svg>
                    back
                </button>

                <div id="sp2-inner">

                    {/* ── IMAGE SLIDER ── */}
                    <div id="sp2-imgwrap"
                        onTouchStart={onTouchStart}
                        onTouchEnd={onTouchEnd}
                    >
                        <img
                            src={ allImages[currentImg]?.image_url || product.image_url }
                            alt={ product.name }
                        />

                        { allImages.length > 1 &&
                            <>
                                <button className="sp2-img-arrow left" onClick={prevImg}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <polyline points="15 18 9 12 15 6"/>
                                    </svg>
                                </button>
                                <button className="sp2-img-arrow right" onClick={nextImg}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <polyline points="9 18 15 12 9 6"/>
                                    </svg>
                                </button>
                                <div className="sp2-img-dots">
                                    { allImages.map((_, i) => (
                                        <button
                                            key={i}
                                            className={`sp2-img-dot${ i === currentImg ? ' active' : '' }`}
                                            onClick={() => setcurrentImg(i)}
                                        />
                                    ))}
                                </div>
                            </>
                        }

                        { isAdmin &&
                            <div className="sp2-img-toolbar">
                                <label className="sp2-img-add" style={{ cursor:'pointer', display:'flex', alignItems:'center', gap:'5px', fontFamily:'DM Sans, sans-serif', fontSize:'0.68rem', fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase', padding:'6px 12px', borderRadius:'50px', background:'rgba(200,169,110,0.15)', color:'#c8a96e', border:'1px solid rgba(200,169,110,0.3)' }}>
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                        <polyline points="17 8 12 3 7 8"/>
                                        <line x1="12" y1="3" x2="12" y2="15"/>
                                    </svg>
                                    add image
                                    <input type="file" accept="image/*" style={{ display:'none' }}
                                        onChange={e => addImage(e.target.files[0])}
                                    />
                                </label>

                                { currentImg > 0 &&
                                    <button className="sp2-img-del" onClick={deleteCurrentImage}>
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <polyline points="3 6 5 6 21 6"/>
                                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                                        </svg>
                                        delete
                                    </button>
                                }

                                <span className="sp2-img-counter">
                                    { currentImg + 1 } / { allImages.length }
                                </span>
                            </div>
                        }
                    </div>

                    {/* ── DETAILS ── */}
                    <div id="sp2-details">

                        { product.category &&
                            <div id="sp2-cat-badge">{ product.category }</div>
                        }
                        <h1 id="sp2-name">{ product.name }</h1>
                        <p id="sp2-price">${ Number(product.price).toFixed(2) }</p>

                        {/* description */}
                        <div id="sp2-desc">
                            { product.description
                                ? <p>{ product.description }</p>
                                : <p className="sp2-desc-empty">no description yet</p>
                            }
                            { isAdmin &&
                                <button id="sp2-editdesc" onClick={() => {
                                    setdescDraft(product.description || '');
                                    setshowDescEdit(true);
                                    document.body.style.overflow = 'hidden';
                                }}>
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                    </svg>
                                    { product.description ? 'edit description' : 'add description' }
                                </button>
                            }
                        </div>

                        {/* sizes */}
                        <div id="sp2-sizes">
                            <p id="sp2-size-label">
                                select size
                                { !selectedSize && <span className="sp2-size-hint"> — required</span> }
                            </p>

                            { isAdmin &&
                                <div className="size-add-row">
                                    <input
                                        className="size-add-input"
                                        type="text"
                                        placeholder="add size e.g. 42 or XL"
                                        value={newSize}
                                        onChange={e => setnewSize(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && addSize()}
                                    />
                                    <button className="size-add-btn" onClick={addSize}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <line x1="12" y1="5" x2="12" y2="19"/>
                                            <line x1="5" y1="12" x2="19" y2="12"/>
                                        </svg>
                                        add
                                    </button>
                                </div>
                            }

                            <div id="sp2-size-grid">
                                { sizes.map(row => (
                                    <div key={row.id} className="sp2-size-cell">
                                        <button
                                            className={`sp2-size-btn${ !row.available ? ' unavailable' : '' }${ selectedSize === row.size ? ' selected' : '' }`}
                                            disabled={ !row.available }
                                            onClick={() => setselectedSize(row.size)}
                                        >{ row.size }</button>
                                        { isAdmin &&
                                            <div className="sp2-size-admin-btns">
                                                <button className="sp2-size-toggle" onClick={() => toggleSize(row)}
                                                    title={ row.available ? 'mark unavailable' : 'mark available' }>
                                                    { row.available
                                                        ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                                        : <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                                                    }
                                                </button>
                                                <button className="sp2-size-delete" onClick={() => deleteSize(row)} title="delete size">
                                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                        <polyline points="3 6 5 6 21 6"/>
                                                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                                                    </svg>
                                                </button>
                                            </div>
                                        }
                                    </div>
                                ))}
                                { sizes.length === 0 &&
                                    <p className="no-sizes-yet">{ isAdmin ? 'add sizes above' : 'sizes coming soon' }</p>
                                }
                            </div>
                        </div>

                        {/* ── QUANTITY ── */}
                        <div id="sp2-quantity">
                            <p id="sp2-qty-label">quantity</p>
                            <div id="sp2-qty-controls">
                                <button
                                    className="sp2-qty-btn"
                                    onClick={() => setquantity(q => Math.max(1, q - 1))}
                                    disabled={ quantity <= 1 }
                                >−</button>
                                <span id="sp2-qty-value">{ quantity }</span>
                                <button
                                    className="sp2-qty-btn"
                                    onClick={() => setquantity(q => Math.min(10, q + 1))}
                                    disabled={ quantity >= 10 }
                                >+</button>
                            </div>
                        </div>

                        <button id="sp2-buy" disabled={ !selectedSize } onClick={ openOrder }>
                            { selectedSize ? `buy — size ${selectedSize}` : 'select a size to buy' }
                        </button>

                    </div>
                </div>
            </div>

            {/* ======= DESCRIPTION MODAL ======= */}
            { showDescEdit &&
                <div className="sp2-modal-bg">
                    <div className="sp2-modal">
                        <h2 className="sp2-modal-title">{ product.description ? 'edit description' : 'add description' }</h2>
                        <textarea className="sp2-textarea" placeholder="write a description..."
                            value={descDraft} onChange={(e) => setdescDraft(e.target.value)} rows={5}
                        />
                        <div className="sp2-modal-btns">
                            <button className="sp2-btn-cancel" onClick={() => { setshowDescEdit(false); document.body.style.overflow = 'auto'; }}>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                                </svg>
                                cancel
                            </button>
                            <button className="sp2-btn-confirm" onClick={saveDesc}>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <polyline points="20 6 9 17 4 12"/>
                                </svg>
                                save
                            </button>
                        </div>
                    </div>
                </div>
            }

            {/* ======= ORDER MODAL ======= */}
            { showOrder &&
                <div className="sp2-modal-bg">
                    <div className="sp2-modal sp2-order-modal">
                        { sent
                            ? <>
                                <div className="sp2-success-icon">✓</div>
                                <h2 className="sp2-modal-title">order received!</h2>
                                <p className="sp2-modal-sub">we will contact you shortly</p>
                                <button className="sp2-btn-confirm" style={{ width:'100%', marginTop:'8px' }} onClick={closeOrder}>close</button>
                            </>
                            : <>
                                <h2 className="sp2-modal-title">complete your order</h2>
                                <p className="sp2-modal-sub">{ product.name } — size { selectedSize } — qty { quantity } — ${ (Number(product.price) * quantity).toFixed(2) }</p>
                                <div className="sp2-form">
                                    <input className="sp2-input" type="text" placeholder="full name" value={orderForm.fullname} onChange={e => setorderForm(p => ({ ...p, fullname: e.target.value }))}/>
                                    <input className="sp2-input" type="email" placeholder="email" value={orderForm.email} onChange={e => setorderForm(p => ({ ...p, email: e.target.value }))}/>
                                    <input className="sp2-input" type="tel" placeholder="phone number" value={orderForm.phone} onChange={e => setorderForm(p => ({ ...p, phone: e.target.value }))}/>
                                    <input className="sp2-input" type="text" placeholder="shipping address" value={orderForm.address} onChange={e => setorderForm(p => ({ ...p, address: e.target.value }))}/>
                                    <input className="sp2-input" type="text" placeholder="city" value={orderForm.city} onChange={e => setorderForm(p => ({ ...p, city: e.target.value }))}/>
                                    <select className="sp2-input sp2-select" value={orderForm.wilaya} onChange={e => setorderForm(p => ({ ...p, wilaya: e.target.value }))}>
                                        <option value="">select wilaya</option>
                                        { WILAYAS.map(w => <option key={w} value={w}>{ w }</option>) }
                                    </select>
                                </div>
                                { orderError && <p className="sp2-error">{ orderError }</p> }
                                <div className="sp2-modal-btns">
                                    <button className="sp2-btn-cancel" onClick={closeOrder}>
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                                        </svg>
                                        cancel
                                    </button>
                                    <button className="sp2-btn-confirm" onClick={sendOrder} disabled={sending}>
                                        { sending ? 'sending...' : <>
                                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                <polyline points="20 6 9 17 4 12"/>
                                            </svg>
                                            place order
                                        </> }
                                    </button>
                                </div>
                            </>
                        }
                    </div>
                </div>
            }
        </>
    );
}

export default ShopPage2;