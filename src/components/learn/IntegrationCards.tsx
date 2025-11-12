interface IntegrationCardsProps {
  showWishlistBadge?: boolean;
}

export const IntegrationCards = ({ showWishlistBadge = false }: IntegrationCardsProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <div className="bg-card border rounded-lg p-4 pt-8 text-center relative">
        {showWishlistBadge && (
          <div className="absolute top-2 right-2">
            <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-2 py-1 rounded-full">Wish list</span>
          </div>
        )}
        <div className="text-2xl mb-2">📅</div>
        <h3 className="font-medium text-foreground">Calendar</h3>
      </div>
      
      <div className="bg-card border rounded-lg p-4 pt-8 text-center relative">
        {showWishlistBadge && (
          <div className="absolute top-2 right-2">
            <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-2 py-1 rounded-full">Wish list</span>
          </div>
        )}
        <div className="text-2xl mb-2">✉️</div>
        <h3 className="font-medium text-foreground">Email</h3>
      </div>
      
      <div className="bg-card border rounded-lg p-4 pt-8 text-center relative">
        {showWishlistBadge && (
          <div className="absolute top-2 right-2">
            <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-2 py-1 rounded-full">Wish list</span>
          </div>
        )}
        <div className="text-2xl mb-2">📂</div>
        <h3 className="font-medium text-foreground">Dropbox</h3>
      </div>
      
      <div className="bg-card border rounded-lg p-4 pt-8 text-center relative">
        {showWishlistBadge && (
          <div className="absolute top-2 right-2">
            <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-2 py-1 rounded-full">Wish list</span>
          </div>
        )}
        <div className="text-2xl mb-2">📂</div>
        <h3 className="font-medium text-foreground">Google Drive</h3>
      </div>
      
      <div className="bg-card border rounded-lg p-4 pt-8 text-center relative">
        {showWishlistBadge && (
          <div className="absolute top-2 right-2">
            <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-2 py-1 rounded-full">Wish list</span>
          </div>
        )}
        <div className="text-2xl mb-2">📂</div>
        <h3 className="font-medium text-foreground">OneDrive</h3>
      </div>
      
      <div className="bg-card border rounded-lg p-4 pt-8 text-center relative">
        {showWishlistBadge && (
          <div className="absolute top-2 right-2">
            <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-2 py-1 rounded-full">Wish list</span>
          </div>
        )}
        <div className="text-2xl mb-2">➕</div>
        <h3 className="font-medium text-foreground text-sm">Others (to be determined)</h3>
      </div>
    </div>
  );
};
