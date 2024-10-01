'use client'
import DownloadData from '@/components/settings/download/data';
import post2 from '@/public/images/blogs/post2.jpg';
import { StaticImageData } from 'next/image';


type Download = {
  title: string,
  image: StaticImageData,

}


export default function Download() {
    // const [downloads, setDownloads] = useState<Download[]>([
    //     {
    //         title   : 'My Information',
    //         image   : post2
    //     },
    //     {
    //         title   : 'My posts',
    //         image   : post2
    //     },
    //     {
    //         title   : 'My Groups',
    //         image   : post2,
    //     },
    //     {
    //         title   : 'My Pages',
    //         image   : post2
    //     },
    //     {
    //         title   : 'Followers',
    //         image   : post2
    //     },
    //     {
    //         title   : 'Following',
    //         image   : post2
    //     }
       
    // ])
    const downloads = [
        {
            title   : 'My Information',
            image   : post2
        },
        {
            title   : 'My posts',
            image   : post2
        },
        {
            title   : 'My Groups',
            image   : post2,
        },
        {
            title   : 'My Pages',
            image   : post2
        },
        {
            title   : 'Followers',
            image   : post2
        },
        {
            title   : 'Following',
            image   : post2
        }
       
    ]
  return (
      <>
          <main className="flex flex-col bg-gray-200 min-h-screen text-center ">
              <h1 className="text-xl mb-2 mt-10 mx-auto text-gray-800 font-bold lg:[15rem]" >Download My Information </h1>
              <p className="text-sm mb-2 mx-auto text-gray-800 font-bold leg:pr-[3rem] ">Please choose whichever Information you would like to download</p>
              <DownloadData downloads={downloads} />
             
              <button
                  type="submit"
                  className="bg-red-500 h-[2rem] w-[8rem] text-white text-sm px-4 py-2 mx-auto rounded-md hover:bg-red-600 transition-colors duration-300"
              >
                  Generate File
              </button>


          </main>
      </>
  );
}
