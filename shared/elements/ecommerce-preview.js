window.ConsicaElements = window.ConsicaElements || {};

window.ConsicaElements.ecommercePreview = function (layout) {
  const isMobile = layout === 'mobile';

  return `
    <div class="ecommerce-preview-wrapper relative group flex items-center justify-center gap-8 w-full ${isMobile ? 'scale-[0.55] my-[-110px]' : 'scale-100'} origin-center">
      <!-- Decorative geometric shapes -->
      <div class="absolute -bottom-6 -right-6 w-12 h-12 bg-red-400/20 rounded-full animate-float"></div>
      <div class="absolute top-1/4 -right-12 w-8 h-8 border-2 border-red-400/20 rounded-lg rotate-45 animate-float-delay"></div>

      <!-- Phone 1: Home Screen -->
      <div class="w-[260px] h-[520px] glass-panel bg-section-tint rounded-[2.5rem] shadow-2xl overflow-hidden border-[6px] border-theme relative flex flex-col shrink-0" style="box-shadow: 0 25px 50px -12px rgba(255, 59, 48, 0.25);">
        <!-- Notch -->
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-surface-darker border-b border-l border-r border-theme rounded-b-2xl z-20"></div>

        <!-- Header -->
        <div class="bg-[#FF3B30] text-white pt-10 pb-6 px-5 rounded-b-[2rem] relative z-10 shadow-md">
          <div class="flex justify-between items-center mb-4">
            <div>
              <p class="text-[10px] opacity-80 font-medium">Location</p>
              <p class="text-xs font-bold flex items-center gap-1">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path></svg>
                New York, USA
              </p>
            </div>
            <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
            </div>
          </div>
          <!-- Search -->
          <div class="glass-panel bg-section-tint border border-theme rounded-xl px-3 py-2.5 flex items-center gap-2">
            <svg class="w-4 h-4 text-theme-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <span class="text-xs text-theme-muted font-medium">Search</span>
            <div class="ml-auto w-5 h-5 bg-black/10 dark:bg-white/10 rounded flex items-center justify-center">
              <svg class="w-3 h-3 text-theme-soft" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
            </div>
          </div>
        </div>

        <!-- Content -->
        <div class="flex-1 bg-transparent overflow-hidden flex flex-col pt-4 px-4 gap-5">
          <!-- Banner -->
          <div>
            <div class="flex justify-between items-end mb-2">
              <h4 class="text-sm font-bold text-theme">#SpecialForYou</h4>
              <span class="text-[9px] text-[#FF3B30] font-bold">See All</span>
            </div>
            <div class="bg-surface-darker border border-theme rounded-2xl p-4 text-white relative overflow-hidden h-28">
               <div class="absolute top-0 right-0 w-24 h-24 bg-[#FF3B30] rounded-full blur-2xl opacity-40 -mr-8 -mt-8"></div>
               <div class="absolute bottom-0 right-0 w-24 h-28 flex items-end justify-center text-5xl translate-x-2">🙋‍♀️</div>
               <span class="inline-block px-2 py-0.5 bg-white/20 rounded text-[8px] backdrop-blur-sm mb-2 relative z-10">Limited time!</span>
               <h5 class="font-bold text-sm text-white relative z-10">Get Special Offer</h5>
               <p class="text-[10px] text-white/70 mt-1 relative z-10">Up to <span class="text-lg font-bold text-white">40%</span></p>
               <button class="absolute bottom-3 right-3 bg-[#FF3B30] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-lg z-10">Claim</button>
            </div>
          </div>

          <!-- Categories -->
          <div>
            <div class="flex justify-between items-end mb-3">
              <h4 class="text-sm font-bold text-theme">Category</h4>
              <span class="text-[9px] text-[#FF3B30] font-bold">See All</span>
            </div>
            <div class="flex justify-between">
               <div class="flex flex-col items-center gap-1.5">
                 <div class="w-11 h-11 bg-[#FF3B30]/10 rounded-full flex items-center justify-center text-[#FF3B30] text-lg border border-[#FF3B30]/20">👕</div>
                 <span class="text-[9px] font-medium text-theme-soft">Clothes</span>
               </div>
               <div class="flex flex-col items-center gap-1.5">
                 <div class="w-11 h-11 glass-panel bg-section-tint rounded-full flex items-center justify-center text-theme-soft text-lg border border-theme">💻</div>
                 <span class="text-[9px] font-medium text-theme-soft">Electronics</span>
               </div>
               <div class="flex flex-col items-center gap-1.5">
                 <div class="w-11 h-11 glass-panel bg-section-tint rounded-full flex items-center justify-center text-theme-soft text-lg border border-theme">👟</div>
                 <span class="text-[9px] font-medium text-theme-soft">Shoes</span>
               </div>
               <div class="flex flex-col items-center gap-1.5">
                 <div class="w-11 h-11 glass-panel bg-section-tint rounded-full flex items-center justify-center text-theme-soft text-lg border border-theme">⌚</div>
                 <span class="text-[9px] font-medium text-theme-soft">Watch</span>
               </div>
            </div>
          </div>
          
          <!-- Flash Sale (Partial) -->
          <div>
            <div class="flex justify-between items-end mb-3">
              <h4 class="text-sm font-bold text-theme">Flash Sale</h4>
              <span class="text-[9px] text-theme-muted font-medium">Closing in: <span class="text-[#FF3B30]">02 : 12 : 56</span></span>
            </div>
            <div class="flex gap-2 text-[10px]">
              <span class="px-3 py-1.5 glass-panel bg-section-tint border border-theme rounded-full text-theme-soft font-medium">All</span>
              <span class="px-3 py-1.5 bg-[#FF3B30] text-white border border-[#FF3B30] rounded-full font-bold shadow-sm">Newest</span>
              <span class="px-3 py-1.5 glass-panel bg-section-tint border border-theme rounded-full text-theme-soft font-medium">Popular</span>
              <span class="px-3 py-1.5 glass-panel bg-section-tint border border-theme rounded-full text-theme-soft font-medium">Clothes</span>
            </div>
          </div>

        </div>

        <!-- Bottom Nav -->
        <div class="glass-panel border-t border-theme border-l-0 border-r-0 border-b-0 py-3 px-6 flex justify-between items-center rounded-b-[2.1rem] relative z-10 shadow-lg" style="background: var(--nav-glass);">
          <div class="flex flex-col items-center gap-1 text-[#FF3B30]">
             <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
             <span class="text-[8px] font-bold">Home</span>
          </div>
          <div class="flex flex-col items-center gap-1 text-theme-muted hover:text-theme transition-colors">
             <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
             <span class="text-[8px] font-bold">Wishlist</span>
          </div>
          <div class="flex flex-col items-center gap-1 text-theme-muted hover:text-theme transition-colors relative">
             <div class="absolute -top-1 -right-1 w-3 h-3 bg-[#FF3B30] rounded-full border-2 border-theme"></div>
             <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
             <span class="text-[8px] font-bold">Cart</span>
          </div>
          <div class="flex flex-col items-center gap-1 text-theme-muted hover:text-theme transition-colors">
             <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
             <span class="text-[8px] font-bold">Chat</span>
          </div>
          <div class="flex flex-col items-center gap-1 text-theme-muted hover:text-theme transition-colors">
             <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
             <span class="text-[8px] font-bold">Profile</span>
          </div>
        </div>
      </div>

      <!-- Phone 2: Product Details (Hidden on mobile to fit screen, visible on tablet/desktop) -->
      ${!isMobile ? `
      <div class="w-[260px] h-[520px] glass-panel bg-section-tint rounded-[2.5rem] shadow-2xl overflow-hidden border-[6px] border-theme relative flex flex-col shrink-0" style="box-shadow: 0 25px 50px -12px rgba(255, 59, 48, 0.15);">
        <!-- Notch -->
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-surface-darker border-b border-l border-r border-theme rounded-b-2xl z-20"></div>

        <!-- Header -->
        <div class="bg-transparent border-b border-theme pt-10 pb-4 px-5 flex justify-between items-center z-10 relative">
           <div class="w-8 h-8 glass-panel bg-section-tint rounded-full flex items-center justify-center shadow-sm hover:bg-theme-faint cursor-pointer transition-colors border border-theme">
             <svg class="w-4 h-4 text-theme" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
           </div>
           <h3 class="font-bold text-theme text-sm">Product Details</h3>
           <div class="w-8 h-8 glass-panel bg-section-tint rounded-full flex items-center justify-center shadow-sm hover:bg-theme-faint cursor-pointer transition-colors border border-theme">
             <svg class="w-4 h-4 text-theme-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
           </div>
        </div>

        <!-- Product Image Area -->
        <div class="h-48 bg-transparent relative flex items-center justify-center overflow-hidden border-b border-theme">
          <div class="absolute inset-0 bg-gradient-to-b from-transparent to-surface-darker/10"></div>
          
          <div class="w-full h-full relative z-10 flex flex-col items-center justify-center mt-[-10px]">
             <svg class="w-16 h-16 text-brand-300 opacity-60 animate-pulse" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1,0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0,1-1.12-1.243l1.264-12A1.125 1.125 0 0,1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1,1-.75 0 .375.375 0 0,1 .75 0Zm7.5 0a.375.375 0 1,1-.75 0 .375.375 0 0,1 .75 0Z" />
             </svg>
          </div>
          
          <!-- Thumbnails -->
          <div class="absolute bottom-4 left-0 w-full flex justify-center gap-2 z-20">
             <div class="w-9 h-9 glass-panel bg-section-tint rounded-xl border-2 border-[#FF3B30] flex items-center justify-center shadow-md relative overflow-hidden"><div class="text-xl">🧥</div></div>
             <div class="w-9 h-9 glass-panel bg-section-tint rounded-xl border border-theme flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity"><div class="text-xl">👕</div></div>
             <div class="w-9 h-9 glass-panel bg-section-tint rounded-xl border border-theme flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity"><div class="text-xl">👔</div></div>
             <div class="w-9 h-9 glass-panel bg-section-tint rounded-xl border border-theme flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity"><div class="text-xl">👗</div></div>
             <div class="w-9 h-9 bg-[#FF3B30] rounded-xl border border-[#FF3B30] flex items-center justify-center shadow-sm text-white font-bold text-[10px]">+10</div>
          </div>
        </div>

        <!-- Content -->
        <div class="flex-1 bg-transparent px-5 pt-5 flex flex-col relative z-20">
           <div class="flex justify-between items-start mb-2">
             <span class="text-[10px] text-theme-muted font-medium">Clothes</span>
             <div class="flex items-center gap-1 bg-yellow-500/10 px-2 py-0.5 rounded text-yellow-500 border border-yellow-500/20">
               <svg class="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
               <span class="text-[10px] font-bold">4.5</span>
             </div>
           </div>
           <h2 class="text-[17px] font-bold text-theme mb-4 tracking-tight">Light Brown Coat</h2>

           <!-- Seller -->
           <div class="mb-1 text-[10px] text-theme font-bold">Seller</div>
           <div class="flex justify-between items-center mb-5">
             <div class="flex items-center gap-2">
               <div class="w-10 h-10 rounded-full bg-surface-darker overflow-hidden flex items-center justify-center border border-theme">
                 <svg class="w-5 h-5 text-theme-muted" fill="currentColor" viewBox="0 0 20 20">
                   <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                 </svg>
               </div>
               <div>
                 <p class="text-[11px] font-bold text-theme">Amy</p>
                 <p class="text-[9px] text-theme-muted">Manager</p>
               </div>
             </div>
             <div class="flex gap-2">
               <div class="w-8 h-8 rounded-full bg-[#FF3B30]/10 flex items-center justify-center text-[#FF3B30] hover:bg-[#FF3B30]/20 transition-colors border border-[#FF3B30]/20">
                 <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd"></path></svg>
               </div>
               <div class="w-8 h-8 rounded-full bg-[#FF3B30]/10 flex items-center justify-center text-[#FF3B30] hover:bg-[#FF3B30]/20 transition-colors border border-[#FF3B30]/20">
                 <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path></svg>
               </div>
             </div>
           </div>

           <!-- Description -->
           <h4 class="text-[11px] font-bold text-theme mb-1.5">Product Details</h4>
           <p class="text-[9px] text-theme-muted leading-relaxed mb-4">Premium quality, lightweight, and versatile. This classic brown coat is tailored for comfort and modern style. Perfect for all seasons and any occasion. <span class="text-[#FF3B30] font-bold cursor-pointer hover:underline">Read more</span></p>

           <!-- Size -->
           <div class="mb-4 pt-4 border-t border-theme">
             <h4 class="text-[11px] font-bold text-theme mb-2">Select Size</h4>
             <div class="flex gap-2">
               <div class="w-8 h-8 rounded glass-panel bg-section-tint border border-theme flex items-center justify-center text-[10px] font-bold text-theme-soft">S</div>
               <div class="w-8 h-8 rounded bg-[#FF3B30] border border-[#FF3B30] flex items-center justify-center text-[10px] font-bold text-white shadow-md">M</div>
               <div class="w-8 h-8 rounded glass-panel bg-section-tint border border-theme flex items-center justify-center text-[10px] font-bold text-theme-soft">L</div>
               <div class="w-8 h-8 rounded glass-panel bg-section-tint border border-theme flex items-center justify-center text-[10px] font-bold text-theme-soft">XL</div>
             </div>
           </div>

           <!-- Bottom action -->
           <div class="mt-auto pb-5 flex justify-between items-center">
             <div>
               <p class="text-[10px] text-theme-muted font-medium">Total Price</p>
               <p class="text-[17px] font-bold text-theme">$120.00</p>
             </div>
             <button class="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-1.5 font-bold text-[10px] shadow-[0_4px_12px_rgba(37,99,235,0.3)] hover:bg-blue-700 transition-all hover:-translate-y-0.5">
               <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
               Add to Cart
             </button>
           </div>
        </div>
      </div>
      ` : ''}
    </div>
  `;
}
