function JumpToColumn({
  totalPages,
  jumpPage,
  setJumpPage,
  handleJumpToPage,
  totalCount,
}: {
  totalPages: any;
  jumpPage: any;
  setJumpPage: any;
  handleJumpToPage: any;
  totalCount: any;
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
      <span>Total Count :- {totalCount}</span>
    </div>
  );
}

export default JumpToColumn;
