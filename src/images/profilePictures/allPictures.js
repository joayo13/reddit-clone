import i0 from './avatar_default_02_0DD3BB.png'
import i1 from './avatar_default_02_7E53C1.png'
import i2 from './avatar_default_02_24A0ED.png'
import i3 from './avatar_default_02_25B79F.png'
import i4 from './avatar_default_02_46A508.png'
import i5 from './avatar_default_02_46D160.png'
// import i6 from 
// import i7 from
// import i8 from
// import i9 from
// import i10 from
// import i11 from
// import i12 from
// import i13 from
// import i14 from
// import i15 from
// import i16 from
// import i17 from
// import i18 from
// import i19 from
// import i20 from
// import i21 from
// import i22 from
// import i23 from
// import i24 from

function importAll(r) {
    return r.keys().map(r);
  }
  
  const images = importAll(require.context('./', false, /\.(png|jpe?g|svg)$/));

  console.log(images)


export default images
