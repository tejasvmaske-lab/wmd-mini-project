# To run the Admin server

Open terminal and open the Admin folder inside the terminal

Paste this code

`json-server --watch db.json`

```
{pets.map((pet, index) => (
<tr key={pet.id}>
<td>{index + 1}</td>
<td>{pet.petName}</td>
<td>{pet.petType}</td>
<td>{pet.age}</td>
</tr>
```

`pets.map((pet, index)` -> the keyword `index` is added so that we get proper indexing for the id
section

`<td>{index + 1}</td>` -> gives indexing number. We added `index + 1` because indexing starts 
from 0.

### NOTE

> This indexing is only seen on the frontend, i.e. is the table where the data of all the pets
are seen, whereas in the db.json file, it will still have the same IDs given (those random letters)