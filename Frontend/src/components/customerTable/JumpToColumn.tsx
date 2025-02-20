function JumpToColumn({
  totalPages,
  jumpPage,
  setJumpPage,
  handleJumpToPage,
}: {
  totalPages: any;
  jumpPage: any;
  setJumpPage: any;
  handleJumpToPage: any;
}) {
  return (
    <div className="pageJump">
      <input
        type="number"
        min="1"
        max={totalPages}
        value={jumpPage}
        onChange={(e) => setJumpPage(e.target.value)}
      />
      <button onClick={handleJumpToPage}>Jump To Page</button>
    </div>
  );
}

export default JumpToColumn;
