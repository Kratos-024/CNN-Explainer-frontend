const menuData = [
  {
    title: "CNN",
    sub: ["Basic CNN", "ResNet"],
  },
  {
    title: "LLM",
    sub: ["Transformers", "GPT-style"],
  },
  {
    title: "AI Models",
    sub: ["Future options"],
  },
];

const NavBar = () => {
  return (
    <nav className="w-full bg-white shadow px-8 py-4 flex items-center space-x-10 sticky top-0 z-50">
      {menuData.map((menu) => (
        <div key={menu.title} className="relative group">
          <button className="px-4 py-2 rounded hover:bg-gray-100 transition">
            {menu.title}
          </button>
          {menu.sub && menu.sub.length > 0 && (
            <div className="absolute top-full left-0 mt-1 w-40 bg-white rounded shadow-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all">
              {menu.sub.map((item) => (
                <div
                  key={item}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
};

export default NavBar;

//  <div className="  w-225  mx-auto ">
//    <h1 className=" text-center">Add image</h1>
//    <input
//      onChange={(e) => {
//        if (e.target.files && e.target.files[0]) {
//          setImage(e.target.files[0]);
//        }
//      }}
//      type="file"
//      accept="image"
//    ></input>
//    {image && (
//      <div>
//        <img src={URL.createObjectURL(image)} />
//      </div>
//    )}{" "}
//    {predictedclass && <h3>{predictedclass}</h3>}
//  </div>;
