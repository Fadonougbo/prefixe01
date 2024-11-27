import { type FormEvent, useRef, useState } from "react";

import vCard from "vcf";

function App() {
	const [count, setCount] = useState(0);

	const [u, setU] = useState("");

	const formRef = useRef(null);
	const inputRef = useRef<HTMLInputElement | null>(null);


	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		const curentInput = inputRef?.current as HTMLInputElement;

		if (curentInput.files) {
			const file = curentInput?.files[0];

			const reader = new FileReader();

			reader.readAsText(file);

			reader.addEventListener("load", () => {
				const contacts = reader.result
					?.toString()
					.split("END:VCARD");
				
				const regex229 =
					/(\+229)(42|46|50|51|52|53|54|56|57|59|61|62|66|67|69|90|91|96|97|45|55|60|63|64|65|68|94|95|98|99|43|44|47)(\d{6})$/gm;

				const regexWithout229 =
					/(42|46|50|51|52|53|54|56|57|59|61|62|66|67|69|90|91|96|97|45|55|60|63|64|65|68|94|95|98|99|43|44|47)(\d)-(\d{3})-(\d{2})$/gm;

				const contactWidth229 = contacts?.filter((contact) => {
					return regex229.test(contact);
				});

				


				const contactWidthout229 = contacts?.filter((contact) => {
					return regexWithout229.test(contact);
				});
				
				
       
				const replaceWith22901 = contactWidth229?.map((contact) => {
					
					const res = contact.replace(/\r\n/gm,"__").replace(/(TEL;(.+)?:\+229(42|46|50|51|52|53|54|56|57|59|61|62|66|67|69|90|91|96|97|45|55|60|63|64|65|68|94|95|98|99|43|44|47)\d{6}__)+/, (m) => {
						
						const data=m.split("__").map((el)=> {
							
							const r=el.replace(regex229,(m,$a,$b,$c)=> {
								
								return `01${$b}${$c}`
							})
							
							return r
							
						}).join("__")

						return `${data}${m}`;
					});
					
					return res.replace(/__/gm,"\n");
				});

				const replaceWith22901Withoutdash = contactWidthout229?.map(
					(contact) => {
        
						const res = contact.replace(/\r\n/gm,"__").replace(
							/(TEL;(.+)?:(42|46|50|51|52|53|54|56|57|59|61|62|66|67|69|90|91|96|97|45|55|60|63|64|65|68|94|95|98|99|43|44|47)\d-\d{3}-\d{2}__)+/gm,
							(m) => {
								
								const data=m.split("__").map((el)=> {
									const r=el.replace(regexWithout229,(m,$a,$b,$c,$d)=> {
										
										return `01${$a}${$b}${$c}${$d}`
									})
									return r
									
								}).join("__")
								
								return `${data}${m}`;
							},
						);

						return res.replace(/__/gm,"\n");
					},
				);
				
				let newContacts: string[] = [];

				if (replaceWith22901) {
					newContacts=newContacts.concat(replaceWith22901);
				}

				if (replaceWith22901Withoutdash) {
					newContacts=newContacts.concat(replaceWith22901Withoutdash);
				}
				//console.log(newContacts);
				
       // const nameRegex=/^N:(.*)\b$/gm
      /*  const nameRegex=/^N:(.*);(.+);;;$/gm */
				const contactWithNewName=newContacts.map((contact,key)=> {
         
            const res=key===0?contact.trimStart():contact
          
          return `${res}END:VCARD`
          
        })

		console.log(newContacts);

        const blobData=contactWithNewName.join("")

        const blob=new Blob([blobData],{type:"text/vcard"})
        const fileURL = URL.createObjectURL(blob);
        setU(()=> fileURL)
        console.log(blob);

				//console.log(newContacts);

				//^FN:.+\b$
				//console.log(contactWidthout229,contactWidth229);
			});
		}
	};

	return (
		<form
			action=""
			ref={formRef}
			onSubmit={handleSubmit}
			encType="multipart/form-data"
		>
			<input type="file" name="file" id="" ref={inputRef} />
			<button type="submit">click me</button>
      {
       u?<a href={u} download={"new.vcf"}>download</a>:""
      }
		</form>
	);
}

export default App;
